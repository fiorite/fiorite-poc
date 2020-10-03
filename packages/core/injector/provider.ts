import { isServiceKey, ServiceKey } from './service_key';
import { Injector } from './injector';
import { ServiceLifetime } from './service_lifetime';
import {
  ArgumentError,
  ArgumentsLengthError,
  Disposable,
  Equatable,
  Instance,
  InternalError,
  InvalidOperationError,
  isClass,
  isInstance,
  NotImplementedError,
  tryDispose,
  Type
} from '../functional_types';
import { ServiceFactory } from './service_factory';

/**
 * Tuple signature for any provider.
 */
export type ProviderTuple = [Type | Instance] |
  [Type, unknown] |
  [Type, ServiceLifetime] |
  [ServiceKey, Type | ServiceFactory | unknown] |
  [ServiceKey, Type | ServiceFactory, ServiceLifetime];

/**
 * Tuple signature for partial provider.
 */
export type PartialProviderTuple<T> = [Type<T> | ServiceFactory<T> | T] |
  [Type<T> | ServiceFactory<T>, ServiceLifetime];

/**
 * Tuple signature for singleton provider.
 */
export type SingletonTuple = [Type | Instance] | [Type, unknown] | [ServiceKey, Type | ServiceFactory | unknown];

/**
 * Tuple signature for scoped provider.
 */
export type ScopedTuple = [Type] | [ServiceKey, Type | ServiceFactory];

/**
 * Tuple signature for transient provider.
 */
export type TransientTuple = [Type] | [ServiceKey, Type | ServiceFactory];

/**
 * Service qualifier that stores key, lifetime and other mapping data.
 */
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
   */
  get instance(): T | null {
    return this._instance;
  }

  /**
   * Sets service instance.
   *
   * @throws InvalidOperationError provider lifetime is not singleton or instance is already defined.
   */
  set instance(value: T | null) {
    if (this.lifetime.isSingleton) {
      if (value !== this._instance) {
        if (null !== this._instance) {
          throw new InvalidOperationError('Unable to set singleton instance twice.');
        }

        this._instance = value;
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
  private _instance: T | null = null;

  /**
   * Stores internal function that creates service.
   *
   * @internal
   * @private
   */
  private readonly _provide: ServiceFactory<T> = () => {
    throw new NotImplementedError();
  };

  /**
   * Creates singleton provider with specified type.
   * Service key would be same as provided type.
   *
   * @param type
   */
  static singleton<T>(type: Type<T>): Provider<T>;

  /**
   * Creates singleton provider with specified instance.
   * Service key consumes from instance.constructor.
   *
   * @param instance
   */
  static singleton<T>(instance: Instance<T>): Provider<T>;

  /**
   * Creates singleton provider with specified key and type.
   *
   * @param key
   * @param type
   */
  static singleton<T>(key: ServiceKey<T>, type: Type<T>): Provider<T>;

  /**
   * Creates singleton provider with specified key and factory.
   *
   * @param key
   * @param factory
   */
  static singleton<T>(key: ServiceKey<T>, factory: ServiceFactory<T>): Provider<T>;

  /**
   * Creates singleton provider with specified key and instance.
   *
   * @param key
   * @param instance
   */
  static singleton<T>(key: ServiceKey<T>, instance: T): Provider<T>;

  /**
   * Creates singleton provider using argument tuple.
   *
   * @internal
   */
  static singleton<T>(...tuple: SingletonTuple): Provider<T>;

  /**
   * @inheritDoc
   */
  static singleton<T>(...args: any[]): Provider<T> {
    return new Provider<T>(...args as SingletonTuple);
  }

  /**
   * Creates scoped service with specified type.
   * Service key would be same as provided type.
   *
   * @param type
   */
  static scoped<T>(type: Type<T>): Provider<T>;

  /**
   * Creates scoped service with specified key and type.
   *
   * @param key
   * @param type
   */
  static scoped<T>(key: ServiceKey<T>, type: Type<T>): Provider<T>;

  /**
   * Creates scoped service with specified key and factory.
   *
   * @param key
   * @param factory
   */
  static scoped<T>(key: ServiceKey<T>, factory: ServiceFactory<T>): Provider<T>;

  /**
   * Creates scoped provider using tuple.
   *
   * @internal
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

  /**
   * Creates transient provider with specified type.
   * Service key would be same as provided type.
   *
   * @param type
   */
  static transient<T>(type: Type<T>): Provider<T>;

  /**
   * Creates transient provider with specified key and type.
   *
   * @param key
   * @param type
   */
  static transient<T>(key: ServiceKey<T>, type: Type<T>): Provider<T>;

  /**
   * Creates transient provider with specified key and factory.
   *
   * @param key
   * @param factory
   */
  static transient<T>(key: ServiceKey<T>, factory: ServiceFactory<T>): Provider<T>;

  /**
   * Creates transient provider using tuple.
   *
   * @internal
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

  /**
   * Instantiates provider with specified type.
   * Service key would be same as provided type.
   * Service lifetime is {@link ServiceLifetime.Singleton}.
   *
   * @param type
   */
  constructor(type: Type<T>);

  /**
   * Instantiates provider with specified instance.
   * Service key consumes from instance.constructor.
   * Service lifetime is {@link ServiceLifetime.Singleton}.
   *
   * @param instance
   */
  constructor(instance: Instance<T>);

  /**
   * Instantiates provide with specified type and lifetime.
   * Service key would be same as provided type.
   *
   * @param type
   * @param lifetime
   */
  constructor(type: Type<T>, lifetime: ServiceLifetime);

  /**
   * Instantiates provide with specified key and type.
   * Service lifetime is {@link ServiceLifetime.Singleton}.
   *
   * @param key
   * @param type
   */
  constructor(key: ServiceKey<T>, type: Type<T>);

  /**
   * Instantiates provide with specified key and factory.
   * Service lifetime is {@link ServiceLifetime.Singleton}.
   *
   * @param key
   * @param factory
   */
  constructor(key: ServiceKey<T>, factory: ServiceFactory<T>);

  /**
   * Instantiates provide with specified key and instance.
   * Service lifetime is {@link ServiceLifetime.Singleton}.
   *
   * @param key
   * @param instance
   */
  constructor(key: ServiceKey<T>, instance: T);

  /**
   * Instantiates provide with specified key, type and lifetime.
   *
   * @param key
   * @param type
   * @param lifetime
   */
  constructor(key: ServiceKey<T>, type: Type<T>, lifetime: ServiceLifetime);

  /**
   * Instantiates provide with specified key, factory and lifetime.
   *
   * @param key
   * @param factory
   * @param lifetime
   */
  constructor(key: ServiceKey<T>, factory: ServiceFactory<T>, lifetime: ServiceLifetime);

  /**
   * Instantiates provider using tuple.
   *
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
        throw new ArgumentError(`First argument should be Type or instance. "${a}" was provided.`);
      }
    } else if (args.length === 2) {
      const [a, b] = args;

      if (b instanceof ServiceLifetime) {
        this.lifetime = b;

        if (isClass(a)) {
          this.key = a;
          this.type = a;
        } else {
          throw new ArgumentError(`First argument should be Type. "${a}" was provided.`);
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
          throw new ArgumentError(`Second argument should be Type or ServiceFactory or instance. "${b}" was provided.`);
        }
      } else {
        throw new ArgumentError(`First argument should be instance of ServiceLifetime or valid ServiceKey. "${a}" was provided.`);
      }
    } else if (args.length === 3) {
      const [a, b, c] = args;

      if (isServiceKey(a)) {
        if (c instanceof ServiceLifetime) {
          this.key = a;
          this.lifetime = c;

          if (isClass(b)) {
            this.type = b;
          } else if (typeof b === 'function') {
            this.factory = b;
          } else {
            throw new ArgumentError(`Second argument should be Type or ServiceFactory. "${b}" was provided.`);
          }
        } else {
          throw new ArgumentError(`Third argument should be instance of ServiceLifetime. "${c}" was provided.`);
        }
      } else {
        throw new ArgumentError(`First argument should be valid ServiceKey. "${a}" was provided.`);
      }
    } else {
      throw new ArgumentsLengthError(args.length, [1, 3]);
    }

    if (null !== this.type) {
      // TODO: Resolve @Inject() || @InjectAll().

      let parameters: Type[] = Reflect.getMetadata('design:paramtypes', this.type);

      if (!Array.isArray(parameters)) {
        if (this.type.length > 0) {
          throw new InvalidOperationError('Class "' + this.type.name + '" is not decorated. Please decorate your class at least with @Injectable().');
        } else {
          parameters = [];
        }
      }

      this._provide = injector => new this.type!(
        ...parameters.map(parameter => injector.get(parameter)),
      );
    } else if (null !== this.factory) {
      this._provide = this.factory;
    } else if (null !== this.instance) {
      // Do nothing.
    } else {
      throw new InternalError('Provider has no defined type, factory and instance.');
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
        this.instance = this._provide(injector);
      }

      return this.instance!;
    }

    return this._provide(injector);
  }

  /**
   * Disposes service instance.
   */
  async [Symbol.dispose]() {
    await tryDispose(this.instance);
    this._instance = null;
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
      other._instance === this._instance;
  }
}
