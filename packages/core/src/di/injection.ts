import 'reflect-metadata';

import { Collection, HashMap, HashMapError, Stack } from '../collections';
import { Cloneable, Disposable, EqualityComparer, Selector, Type } from '../common';
import { Provider, ProviderFactory, providerRegistry } from './provider';
import { ServiceKey, ServiceLifetime } from './service';

export function Inject(): ParameterDecorator;
export function Inject<T>(key: ServiceKey<T>): ParameterDecorator;
export function Inject<T, R>(key: ServiceKey<T>, selector: Selector<T, R>): ParameterDecorator;
export function Inject<T, R>(key?: ServiceKey<T>, selector?: Selector<T, R>): ParameterDecorator {
  return () => void 0;
}

export function Injectable(): ClassDecorator {
  return () => void 0;
}

export class ProviderCollection extends Collection<Provider> implements Cloneable {
  private _buffer: Provider[] = [];

  get keys() {
    return this.map(x => x.key);
  }

  add(provider: Provider | Type): this {
    if (Type.is('class', provider)) {
      const type = provider as Type;
      provider = new Provider(
        type,
        type,
        providerRegistry.tryGet(type, ServiceLifetime.Singleton),
      );
    }

    if (provider instanceof Provider) {
      this._buffer.push(provider);
    } else {
      throw new TypeError();
    }

    return this;
  }

  addAll(iterable: Iterable<Provider | Type>): this {
    const iterator = iterable[Symbol.iterator]();

    let result = iterator.next();

    while (!result.done) {
      this.add(result.value);

      result = iterator.next();
    }

    return this;
  }

  addSingleton<T>(type: Type<T>): this;
  addSingleton<T>(key: ServiceKey<T>, type: Type<T>): this;
  addSingleton<T>(key: ServiceKey<T>, factory: ProviderFactory<T>): this;
  addSingleton(instance: object): this;
  addSingleton<T extends object>(key: ServiceKey<T>, instance: T): this;

  /**
   * @inheritDoc
   */
  addSingleton(...args: unknown[]): this {
    let key: ServiceKey;
    let provider: Type | ProviderFactory | object;

    let argument: unknown;

    if (args.length === 1) {
      // addSingleton<T extends object>(type: Type<T>): this;
      // addSingleton<T extends object>(instance: T): this;

      [provider] = args as [Type | object];

      if (Type.is('class', provider)) {
        // Reflect
        key = provider as ServiceKey;
      } else if (Type.is('object', provider)) {
        // Instance
        key = (provider as any).constructor as ServiceKey;
      } else {
        throw new TypeError();
      }

    } else if (args.length === 2) {
      [key, provider] = args as [ServiceKey, Type | ProviderFactory | object];

      if (
        !Type.is('class', provider) &&
        !Type.is('function', provider) &&
        !Type.is('object', provider)
      ) {
        throw new TypeError();
      }

      // addSingleton<T extends object>(key: ServiceKey<T>, type: Type<T>): this;
      // addSingleton<T extends object>(key: ServiceKey<T>, factory: (injector: Injector) => T): this;
      // addSingleton<T extends object>(key: ServiceKey<T>, instance: T): this;
    } else {
      throw new TypeError();
    }

    const descriptor = new Provider(key!, provider!, ServiceLifetime.Singleton);

    return this.add(descriptor);
  }

  addScoped<T>(type: Type<T>): this;
  addScoped<T>(key: ServiceKey<T>, type: Type<T>): this;
  addScoped<T>(key: ServiceKey<T>, factory: ProviderFactory<T>): this;

  /**
   * @inheritDoc
   */
  addScoped(...args: unknown[]): this {
    let key: ServiceKey;
    let provider: Type | ProviderFactory;

    if (args.length === 1) {
      [provider] = args as [Type];
      key = provider;
    } else if (args.length === 2) {
      [key, provider] = args as [ServiceKey, Type | ProviderFactory];
    } else {
      throw new TypeError();
    }

    const descriptor = new Provider(key!, provider!, ServiceLifetime.Scoped);

    return this.add(descriptor);
  }

  addTransient<T>(type: Type<T>): this;
  addTransient<T>(key: ServiceKey<T>, type: Type<T>): this;
  addTransient<T>(key: ServiceKey<T>, factory: ProviderFactory<T>): this;

  /**
   * @inheritDoc
   */
  addTransient(...args: unknown[]): this {
    let key: ServiceKey;
    let provider: Type | ProviderFactory;

    if (args.length === 1) {
      [provider] = args as [Type];
      key = provider;
    } else if (args.length === 2) {
      [key, provider] = args as [ServiceKey, Type | ProviderFactory];
    } else {
      throw new TypeError();
    }

    const descriptor = new Provider(key!, provider!, ServiceLifetime.Transient);

    return this.add(descriptor);
  }

  clone(): ProviderCollection {
    return this[Symbol.clone]();
  }

  toInjector(): Injector {
    return new Injector(this);
  }

  [Symbol.clone](): ProviderCollection {
    const clone = Object.create(this) as this;

    clone._buffer = this._buffer.slice();

    return clone;
  }

  [Symbol.iterator]() {
    return this._buffer[Symbol.iterator]();
  }
}



/**
 * Specific error related to {@link Injector}.
 */
export class InjectorError extends TypeError { }

export class Injector extends Collection<ServiceKey> implements Cloneable, Disposable {
  /**
   * Provides associative descriptor mapping.
   *
   * @private
   */
  private _providers = new HashMap<ServiceKey, Provider>();

  /**
   * Stores scoped services.
   *
   * @private
   */
  private _services: HashMap<ServiceKey, unknown>;

  // /**
  //  * Stores scoped services.
  //  *
  //  * @private
  //  */
  // private _transient: WeakSet<object>;

  /**
   * Tracks key dependencies to prevent circular dependency.
   *
   * @protected
   */
  private _callStack: Stack<ServiceKey>;

  static from(providers: Iterable<Provider>, comparer = EqualityComparer.DEFAULT) {
    return new Injector(providers, comparer);
  }

  constructor(providers: Iterable<Provider>, comparer = EqualityComparer.DEFAULT) {
    super();

    try {
      this._providers = HashMap.from(providers, x => x.key, x => x, comparer)
    } catch (error) {
      if (error instanceof HashMapError) {
        const key = error.key as ServiceKey;
        error = new InjectorError('Injection with key "' + key.name + '" is not unique. Try remove duplicates.');
      }

      throw error;
    }

    // try {
    //   this._providers = HashMap.from(descriptors, x => x.key, x => x, comparer);
    // } catch (error) {
    //   if (error instanceof HashMapError) {
    //     const key = error.key as ServiceKey;
    //     error = new ProviderError('Injection with key "' + key.name + '" is not unique. Try remove duplicates.');
    //   }
    //
    //   throw error;
    // }

    this._providers.set(Injector, new Provider(Injector, this));

    this._services = new HashMap<ServiceKey, unknown>([], comparer);
    // this._transient = new WeakSet<object>();
    this._callStack = new Stack<ServiceKey>([], comparer);
  }

  /**
   * Gets service that is associated with provided key.
   *
   * @param key
   */
  get<T>(key: ServiceKey<T>): T {
    if (this._services.has(key)) {
      return this._services.get(key) as T;
    }

    if (this._callStack.has(key)) {
      const path = [...this._callStack, key].map(x => x.name).join(' > ');
      throw new InjectorError('Circular dependency detected: ' + path);
    }

    if (!this._callStack.empty) {
      const previous = this._providers.get(
        this._callStack.peek(),
      );

      if (previous.lifetime < this._providers.get(key).lifetime) {
        // TODO: Add better error.
        throw new InjectorError('Lifetime, dude: TODO');
      }
    }

    try {
      this._callStack.push(key);

      const provider = this._providers.get(key);
      const instance = provider.inject(this) as T;

      if (provider.lifetime === ServiceLifetime.Scoped) {
        this._services.set(key, instance);
      }

      // if (provider.lifetime === ServiceLifetime.Transient && typeof instance === 'object') {
      //   this._transient.add(instance as unknown as object);
      // }

      return instance;
    } catch (error) {
      if (error instanceof HashMapError) {
        error = new InjectorError(
          'Injection with key "' + key.name + '" is not mapped yet. Try add it first.'
        );
      }

      throw error;
    } finally {
      this._callStack.pop();
    }
  }

  /**
   * Checks whether injection with key exists.
   *
   * @param key
   */
  has(key: ServiceKey): boolean {
    return this._providers.has(key);
  }

  /**
   * @inheritDoc
   */
  [Symbol.dispose](): void {
    this._services.values.cast<Disposable>()
      .filter(instance => Type.is('function', instance[Symbol.dispose]))
      .forEach(instance => instance[Symbol.dispose]());
  }

  [Symbol.clone](): Injector {
    const clone = Object.create(this) as this;

    clone._providers = this._providers[Symbol.clone]();
    clone._services = this._services[Symbol.clone]();
    clone._callStack = this._callStack[Symbol.clone]();

    return clone;
  }

  /**
   * Return keys iterator of instantiated services.
   */
  [Symbol.iterator](): Iterator<ServiceKey> {
    return this._providers.keys[Symbol.iterator]();
  }
}

// export class InjectorScope {
//   injector!: Injector;
// }

// class CompositeInjector extends Collection<ServiceKey> implements Injector {
//   readonly _containers: HashSet<Injector>;
//
//   get containers(): Collection<ServiceContainer> {
//     return this._containers;
//   }
//
//   constructor(injectors: Iterable<ServiceContainer>, comparer = EqualityComparer.DEFAULT) {
//     super();
//     this._containers = new HashSet(injectors, comparer);
//   }
//
//   /**
//    * Gets service that is associated with provided key.
//    *
//    * @param key
//    */
//   get<T>(key: ServiceKey<T>): T {
//     return this._containers.single(injector => injector.has(key)).get(key);
//   }
//
//   /**
//    * Gets service that is associated with provided key.
//    *
//    * @param key
//    */
//   has<T>(key: ServiceKey<T>): boolean {
//     return this._containers.some(injector => injector.has(key));
//   }
//
//   /**
//    * @inheritDoc
//    */
//   [Symbol.dispose](): void {
//     this._containers.forEach(injector => injector[Symbol.dispose]());
//   }
//
//   /**
//    * Return keys iterator of instantiated services.
//    */
//   [Symbol.iterator](): Iterator<ServiceKey> {
//     return this._containers.flat()[Symbol.iterator]();
//   }
// }
