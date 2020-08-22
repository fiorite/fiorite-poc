import { ServiceLifetime } from './service_lifetime';
import { ServiceKey } from './service_key';
import { Injector } from './injector';
import { Provide } from './provide';
import { Equatable, Instance } from '../common';
import { InvalidOperationError } from '../errors';

export class ProviderDescriptor<T = unknown> implements Equatable {
  #instance: T | null = null;

  get instance(): T | null {
    return this.#instance;
  }

  readonly #provide: Provide<T>;

  constructor(
    readonly key: ServiceKey<T>,
    provide: Provide<T>,
    readonly lifetime: ServiceLifetime = ServiceLifetime.Singleton,
  ) {
    // TODO: Here the magic.

    this.#provide = provide;

    if (lifetime.isSingleton) {
      const previous = this.#provide;

      this.#provide = injector => {
        if (null === this.#instance) {
          this.#instance = previous(injector);
        }

        return this.#instance;
      }
    }
  }

  provide(injector: Injector): T {
    return this.#provide(injector);
  }

  [Symbol.equals](other: unknown): boolean {
    return other instanceof ProviderDescriptor &&
      other.key === this.key;
  }
}

export class InstanceDescriptor<T> extends ProviderDescriptor<T> {
  constructor(instance: Instance<T>);
  constructor(key: ServiceKey<T>, instance: Instance<T>);
  constructor(...args: unknown[]) {
    let key: ServiceKey<T>;
    let instance: Instance<T>;

    if (args.length === 1) {
      [instance] = args as [Instance<T>];
      key = instance.constructor;
    } else if (args.length === 2) {
      [key, instance] = args as [ServiceKey<T>, Instance<T>];
    } else {
      // TODO: Improve error.
      throw new InvalidOperationError();
    }

    super(key, () => instance, ServiceLifetime.Singleton);
  }

  // TODO: Add comparable symbol.

  // [Symbol.equals](other: unknown): boolean {
  //   return other instanceof InstanceDescriptor &&
  //     other.key === this.key &&
  //     other.instance;
  // }
}

export class AliasDescriptor<T> extends ProviderDescriptor<T> {
  constructor(key: ServiceKey<T>, alias: ServiceKey<T>, lifetime = ServiceLifetime.Singleton) {
    super(key, injector => injector.get(alias), lifetime);
  }
}
