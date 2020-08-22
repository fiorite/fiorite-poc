import 'reflect-metadata';

import { Cloneable, EqualityComparer, Instance, isClass, Selector, Type } from '../common';
import { forEach } from '../operators';
import { collect, Collection } from '../collections';
import { ServiceKey } from './service_key';
import { ServiceLifetime } from './service_lifetime';
import { Provide } from './provide';
import { ProviderDescriptor } from './provider_descriptor';
import { Injector } from './injector';
import { DefaultInjector } from './default_injector';
import { InvalidOperationError, NotImplementedError } from '../errors';

export class ProviderCollection extends Collection<ProviderDescriptor> implements Cloneable {
  static readonly keySelector: Selector<ProviderDescriptor, ServiceKey> = x => x.key;

  #buffer: ProviderDescriptor[] = [];

  get buffer(): readonly ProviderDescriptor[] {
    return this.#buffer;
  }

  get keys(): Collection<ServiceKey> {
    return this.map(x => x.key);
  }

  constructor(iterable: Iterable<ProviderDescriptor> = [], protected keyComparer: EqualityComparer<ServiceKey> = EqualityComparer.DEFAULT) {
    super(EqualityComparer.select(ProviderCollection.keySelector, keyComparer));
    this.#buffer.push(...iterable);
  }

  add(instance: object): this;
  add(type: Type): this;
  add<T>(key: ServiceKey<T>, factory: Provide<T>): this;
  add<T>(key: ServiceKey<T>, instance: object): this;
  add<T>(key: ServiceKey<T>, alias: ServiceKey<T>): this;
  add<T>(type: Type<T>, args: Type[]): this;
  add(...args: unknown[]): this {
    let key: ServiceKey;
    let provide: Provide;
    let lifetime: ServiceLifetime;

    if (args.length === 1) {
      const [arg] = args;

      if (isClass(arg)) {
        const type = arg as Type;
        let paramTypes: Type[] = Reflect.getMetadata('design:paramtypes', type);

        if (!Array.isArray(paramTypes)) {
          if (type.length > 0) {
            // TODO: Make more informational.
            throw new InvalidOperationError('Please decorate your class first.');
          } else {
            paramTypes = [];
          }
        }

        provide = (injector: Injector) => {
          return new type(
            ...paramTypes.map(paramType => injector.get(paramType)),
          );
        }

        key = type;
        lifetime = ServiceLifetime.Singleton;
      } else if (typeof arg === 'object') {
        const instance = arg as Instance;

        key = instance.constructor;
        provide = () => instance;
        lifetime = ServiceLifetime.Singleton;
      } else {
        throw RangeError();
      }

      // const [type] = args as [Type];
    } else if (args.length === 2) {
      if (Array.isArray(args[1])) {
        const [type, parameters] = args as [Type, ConstructorParameters<Type>];

        key = type;
        lifetime = ServiceLifetime.Singleton;

        provide = injector => {
          return new type(
            ...parameters.map(paramType => injector.get(paramType)),
          );
        };
      } else if (isClass(args[1])) {
        const [type, alias] = args as [ServiceKey, ServiceKey];

        key = type;
        lifetime = ServiceLifetime.Singleton;

        provide = injector => injector.get(alias);
      } else if (typeof args[1] === 'object') {
        const [type, instance] = args as [ServiceKey, Instance];

        key = type;
        provide = () => instance;
        lifetime = ServiceLifetime.Singleton;
      } else if (typeof args[1] === 'function') {
        const [type, factory] = args as [ServiceKey, Provide];

        key = type;
        provide = injector => factory(injector);
        lifetime = ServiceLifetime.Singleton;
      } else {
        throw new RangeError();
      }
    } else {
      throw new RangeError();
    }

    const descriptor = new ProviderDescriptor(key, provide, lifetime);
    this.#buffer.push(descriptor);

    return this;
  }

  // /**
  //  * Auto-wires service using reflect metadata.
  //  *
  //  * @param provider
  //  */
  // add(provider: Provider): this;
  //
  // /**
  //  * Auto-wires service using reflect metadata.
  //  *
  //  * @param provider
  //  * @param lifetime
  //  */
  // add(provider: Provider, lifetime: ServiceLifetime): this;
  //
  // /**
  //  * @param key
  //  * @param instance
  //  */
  // add<T>(key: ServiceKey<T>, instance: T): this;
  //
  // /**
  //  * Adds alias to existence service.
  //  *
  //  * @param key
  //  * @param alias
  //  */
  // add<T>(key: ServiceKey<T>, alias: ServiceKey<T>): this;
  //
  // /**
  //  * Adds alias to existence service.
  //  *
  //  * @param key
  //  * @param alias
  //  * @param lifetime
  //  */
  // add<T>(key: ServiceKey<T>, alias: Type<T>, lifetime: ServiceLifetime): this;
  //
  // add<T>(type: Type<T>, args: ConstructorParameters<Type<T>>): this;
  //
  // add<T>(type: Type<T>, args: ConstructorParameters<Type<T>>, lifetime: ServiceLifetime): this;
  //
  // add<T>(type: T, factory: Provide<T>): this;
  //
  // add<T>(type: T, factory: Provide<T>, lifetime: ServiceLifetime): this;
  //
  // add(...args: any[]): this {
  //   if (args.length === 1) {
  //     let provider = args as Provider;
  //
  //     // TODO: Perform something.
  //
  //     // Provider or iterable provider
  //   }
  //
  //   // throw new NotImplementedError();
  //   return this;
  // }

  addAll(providers: Iterable<Type>): this {
    forEach(providers, provider => this.add(provider));

    return this;
  }

  addSingleton(type: Type | object): this {
    return this.add(type);
  }

  addScoped(type: Type): this {
    return this.add(type);
  }

  addTransient(type: Type): this {
    throw new NotImplementedError();
  }

  has(key: ServiceKey): boolean {
    return this.#buffer.findIndex(element => {
      return this.keyComparer(key, ProviderCollection.keySelector(element));
    }) > -1;
  }

  createInjector(): Injector {
    const buffer = this.#buffer.slice();
    const providers = collect(buffer);
    return new DefaultInjector(providers);
  }

  [Symbol.clone](): ProviderCollection {
    return new ProviderCollection(this.#buffer, this.keyComparer);
  }

  [Symbol.iterator](): Iterator<ProviderDescriptor> {
    return this.#buffer[Symbol.iterator]();
  }
}


// export interface LiteralService<T = unknown> {
//   provide: ServiceKey<T>;
//   alias: ServiceKey<T>;
//   arguments: unknown[];
// }
//
// export interface LiteralService<T extends Type> {
//   provide: T;
//   arguments: ConstructorParameters<T>;
// }
