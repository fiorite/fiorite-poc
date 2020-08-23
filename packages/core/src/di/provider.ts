import { isServiceKey, ServiceKey } from './service_key';
import { Injector } from './injector';
import { ServiceLifetime } from './service_lifetime';
import { Disposable, Equatable, Instance, isClass, isInstance, tryDispose, Type } from '../common';
import { InvalidOperationError, NotImplementedError } from '../errors';
import { ServiceFactory } from './service_factory';

/**
 * Tuple signature for any provider.
 */
export type ProviderTuple = [Type] |
  [Type, ServiceLifetime] |
  [ServiceKey, Type | ServiceFactory | object] |
  [ServiceKey, Type | ServiceFactory, ServiceLifetime];

/**
 * Tuple signature for singleton provider.
 */
export type SingletonTuple = [Type] | [ServiceKey, Type | ServiceFactory | object];

/**
 * Tuple signature for scoped provider.
 */
export type ScopedTuple = [Type] | [ServiceKey, Type | ServiceFactory];

/**
 * Tuple signature for transient provider.
 */
export type TransientTuple = [Type] | [ServiceKey, Type | ServiceFactory];

export class Provider<T = unknown> implements Equatable, Disposable {
  /**
   * Gets instance string tag.
   */
  get [Symbol.toStringTag]() {
    return 'Provider';
  }

  /**
   * Stores service key.
   */
  readonly key: ServiceKey<T>;

  /**
   * Stores service lifetime.
   */
  readonly lifetime: ServiceLifetime;

  /**
   * Stores class type to instantiate a service.
   */
  readonly type: Type<T> | null = null;

  /**
   * Stores service factory.
   */
  readonly factory: ServiceFactory<T> | null = null;

  /**
   * Gets service instance.
   *
   * @throws InvalidOperationError provider lifetime is not singleton.
   */
  get instance(): T | null {
    if (this.lifetime.isSingleton) {
      return this.#instance;
    }

    throw new InvalidOperationError('Unable to get #instance of non-singleton provider.');
  }

  /**
   * Sets service instance.
   *
   * @throws InvalidOperationError provider lifetime is not singleton or instance is already defined.
   */
  set instance(value: T | null) {
    if (this.lifetime.isSingleton) {
      if (value !== this.#instance) {
        if (null !== this.#instance) {
          throw new InvalidOperationError(); // TODO: Add Informative error.
        }

        this.#instance = value;
      }

      return;
    }

    throw new InvalidOperationError('Unable to get instance of non-singleton service.');
  }

  /**
   * Stores service instance.
   *
   * @private
   */
  #instance: T | null = null;

  /**
   * Stores function that creates service.
   *
   * @internal
   * @private
   */
  readonly #provide: ServiceFactory<T> = () => {
    throw new NotImplementedError();
  };

  static singleton<T>(type: Type<T>): Provider<T>;
  static singleton<T extends object>(instance: T): Provider<T>;
  static singleton<T>(key: ServiceKey<T>, type: Type<T>): Provider<T>;
  static singleton<T>(key: ServiceKey<T>, factory: ServiceFactory<T>): Provider<T>;
  static singleton<T extends object>(key: ServiceKey<T>, instance: T): Provider<T>;

  /**
   * @internal tuple overload.
   */
  static singleton<T>(...tuple: SingletonTuple): Provider<T>;

  /**
   * @inheritDoc
   */
  static singleton<T>(...args: any[]): Provider<T> {
    return new Provider<T>(...args as SingletonTuple);
  }

  static scoped<T>(type: Type<T>): Provider<T>;
  static scoped<T>(key: ServiceKey<T>, type: Type<T>): Provider<T>;
  static scoped<T>(key: ServiceKey<T>, factory: ServiceFactory<T>): Provider<T>;

  /**
   * @internal tuple overload.
   */
  static scoped<T>(...tuple: ScopedTuple): Provider<T>;

  /**
   * @inheritDoc
   */
  static scoped<T>(...args: any[]): Provider<T> {
    return new Provider<T>(
      ...[...args, ServiceLifetime.Scoped] as ProviderTuple,
    );
  }

  static transient<T>(type: Type<T>): Provider<T>;
  static transient<T>(key: ServiceKey<T>, type: Type<T>): Provider<T>;
  static transient<T>(key: ServiceKey<T>, factory: ServiceFactory<T>): Provider<T>;

  /**
   * @internal tuple overload.
   */
  static transient<T>(...tuple: TransientTuple): Provider<T>;

  /**
   * @inheritDoc
   */
  static transient<T>(...args: any[]): Provider<T> {
    return new Provider<T>(
      ...[...args, ServiceLifetime.Transient] as ProviderTuple,
    );
  }

  constructor(type: Type<T>);
  constructor(instance: Instance<T>);
  constructor(type: Type<T>, lifetime: ServiceLifetime);
  constructor(key: ServiceKey<T>, type: Type<T>);
  constructor(key: ServiceKey<T>, factory: ServiceFactory<T>);
  constructor(key: ServiceKey<T>, instance: Instance<T>);
  constructor(key: ServiceKey<T>, type: Type<T>, lifetime: ServiceLifetime);
  constructor(key: ServiceKey<T>, factory: ServiceFactory<T>, lifetime: ServiceLifetime);

  /**
   * @internal tuple overload.
   */
  constructor(...tuple: ProviderTuple);

  /**
   * @inheritDoc
   */
  constructor(...args: any[]) {
    if (args.length === 1) {
      this.lifetime = ServiceLifetime.Singleton;

      const [a] = args;

      if (isClass(a)) {
        this.key = a;
        this.type = a;
      } else if (isInstance(a)) {
        this.key = a.constructor;
        this.instance = a;
      } else {
        throw new InvalidOperationError(); // TODO: Add informative error.
      }
    } else if (args.length === 2) {
      const [a, b] = args;

      if (b instanceof ServiceLifetime) {
        this.lifetime = b;

        if (isClass(a)) {
          this.key = a;
          this.type = a;
        } else {
          throw new InvalidOperationError(); // TODO: Add informative error.
        }
      } else if (isServiceKey(a)) {
        this.key = a;
        this.lifetime = ServiceLifetime.Singleton;

        if (isClass(b)) {
          this.type = b;
        } else if (isInstance(b)) {
          this.instance = b;
        } else if (typeof b === 'function') {
          this.factory = b;
        } else {
          throw new InvalidOperationError(); // TODO: Add informative error.
        }
      } else {
        throw new InvalidOperationError(); // TODO: Add informative error.
      }
    } else if (args.length === 3) {
      const [a, b, c] = args;

      if (isServiceKey(a) && c instanceof ServiceLifetime) {
        this.key = a;
        this.lifetime = c;

        if (isClass(b)) {
          this.type = b;
        } else if (typeof b === 'function') {
          this.factory = b;
        } else {
          throw new InvalidOperationError(); // TODO: Add informative error.
        }
      } else {
        throw new InvalidOperationError(); // TODO: Add informative error.
      }
    } else {
      throw new InvalidOperationError(); // TODO: Add informative error.
    }

    // Bind service accessor.
    if (null !== this.type) {
      // TODO: Resolve @Inject() || @InjectAll().

      let parameters: Type[] = Reflect.getMetadata('design:paramtypes', this.type);

      if (!Array.isArray(parameters)) {
        if (this.type.length > 0) {
          throw new InvalidOperationError('Class "' + this.type.name + '" is not decorated. Please decorate your class at least by @Injectable().');
        } else {
          parameters = [];
        }
      }

      this.#provide = injector => new this.type!(
        parameters.map(parameter => injector.get(parameter)),
      );
    } else if (null !== this.factory) {
      this.#provide = this.factory;
    } else if (null !== this.instance) {
      // Do nothing.
    } else {
      throw new InvalidOperationError(); // TODO: Add informative error.
    }
  }

  /**
   * Provides service instance.
   *
   * @param injector
   */
  provide(injector: Injector): T {
    if (this.lifetime.isSingleton) {
      if (null === this.instance) {
        this.instance = this.#provide(injector);
      }

      return this.instance!;
    }

    return this.#provide(injector);
  }

  /**
   * Disposes service instance.
   */
  async [Symbol.dispose]() {
    await tryDispose(this.instance);
  }

  /**
   * Checks whether other is the same provider.
   *
   * @param other
   */
  [Symbol.equals](other: unknown): boolean {
    return other instanceof Provider &&
      other.key === this.key &&
      other.type === this.type &&
      other.factory === this.factory &&
      other.#instance === this.#instance;
  }
}
