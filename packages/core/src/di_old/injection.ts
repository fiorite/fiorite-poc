import { Disposable, isClass, Type } from '../common';
import { Injector } from './injector';
import { InjectionLifetime } from './lifetime';
import { InjectionKey } from './key';
import { InjectionFactory } from './factory';

export class Injection<T = unknown> implements Disposable {
  get [Symbol.toStringTag]() {
    return 'Injection';
  }

  /**
   * TODO: Describes.
   */
  readonly key: InjectionKey<T>;

  /**
   * TODO: Describes.
   */
  readonly lifetime: InjectionLifetime = InjectionLifetime.Singleton;

  /**
   * Stores class constructor.
   */
  readonly type: Type<T> |  null = null;

  /**
   * Stores constructor parameters.
   */
  readonly parameters: Type<T>[] |  null = null;

  /**
   * Caches singleton services.
   *
   * @private
   */
  #instance: T | null = null;

  /**
   * TODO: Describe.
   */
  get instance() {
    return this.#instance;
  }

  /**
   * TODO: Describe.
   */
  readonly factory: InjectionFactory<T> | null = null;

  /**
   * TODO: Describe.
   */
  readonly #inject: InjectionFactory<T>;

  /**
   * TODO: Describe.
   *
   * @param type
   */
  static singleton<T>(type: Type<T>): Injection<T>;

  /**
   * TODO: Describe.
   *
   * @param instance
   */
  static singleton<T extends object>(instance: T): Injection<T>;

  /**
   * @internal
   */
  static singleton<T extends object>(argument: Type<T> | T): Injection<T>;

  /**
   * TODO: Describe.
   *
   * @param key
   * @param type
   */
  static singleton<T>(key: InjectionKey<T>, type: Type<T>): Injection<T>;

  /**
   * TODO: Describe.
   *
   * @param key
   * @param factory
   */
  static singleton<T>(key: InjectionKey<T>, factory: InjectionFactory<T>): Injection<T>;

  /**
   * TODO: Describe.
   *
   * @param key
   * @param instance
   */
  static singleton<T>(key: InjectionKey<T>, instance: T): Injection<T>;

  /**
   * @inheritDoc
   */
  static singleton<T>(key: InjectionKey<T>, argument: Type<T> | InjectionFactory<T> | T): Injection<T>;

  /**
   * @inheritDoc
   */
  static singleton(...args: unknown[]): Injection {
    const lifetime = InjectionLifetime.Singleton;

    let key: InjectionKey;
    let argument: InjectionFactory | Type | unknown;

    if (args.length === 1) {
      const [_argument] = args as [Type | object];

      if (isClass(_argument)) {
        key = _argument as Type;
        argument = _argument as Type;
      } else {
        key = (_argument as object).constructor;
        argument = _argument;
      }
    } else if (args.length === 2) {
      [key, argument] = args as [InjectionKey, Type | InjectionFactory | unknown];
    } else {
      throw new RangeError('Wrong arguments number.');
    }

    return new Injection(key, argument, lifetime);
  }

  /**
   * TODO: Describe.
   *
   * @param type
   */
  static scoped<T>(type: Type<T>): Injection<T>;

  /**
   * TODO: Describe.
   *
   * @param key
   * @param type
   */
  static scoped<T>(key: InjectionKey<T>, type: Type<T>): Injection<T>;

  /**
   * TODO: Describe.
   *
   * @param key
   * @param factory
   */
  static scoped<T>(key: InjectionKey<T>, factory: InjectionFactory<T>): Injection<T>;

  /**
   * @inheritDoc
   */
  static scoped<T>(key: InjectionKey<T>, argument: Type<T> | InjectionFactory<T>): Injection<T>;

  /**
   * @inheritDoc
   */
  static scoped(...args: unknown[]): Injection {
    const lifetime = InjectionLifetime.Scoped;

    let key: InjectionKey;
    let argument: InjectionFactory | Type;

    if (args.length === 1) {
      const [_argument] = args as [Type | object];

      key = _argument as Type;
      argument = _argument as Type;
    } else if (args.length === 2) {
      const [_key, _argument] = args as [InjectionKey, Type | InjectionFactory];
      key = _key;

      if (isClass(_argument)) {
        argument = _argument as Type;
      } else {
        argument = _argument as InjectionFactory;
      }
    } else {
      throw new RangeError('Wrong arguments number.');
    }

    return new Injection(key, argument, lifetime);
  }

  /**
   * TODO: Describe.
   *
   * @param type
   */
  static transient<T>(type: Type<T>): Injection<T>;

  /**
   * TODO: Describe.
   *
   * @param key
   * @param type
   */
  static transient<T>(key: InjectionKey<T>, type: Type<T>): Injection<T>;

  /**
   * TODO: Describe.
   *
   * @param key
   * @param factory
   */
  static transient<T>(key: InjectionKey<T>, factory: InjectionFactory<T>): Injection<T>;

  /**
   * @inheritDoc
   */
  static transient<T>(key: InjectionKey<T>, argument: Type<T> | InjectionFactory<T>): Injection<T>;

  /**
   * @inheritDoc
   */
  static transient(...args: unknown[]): Injection {
    const lifetime = InjectionLifetime.Transient;

    let key: InjectionKey;
    let argument: InjectionFactory | Type;

    if (args.length === 1) {
      const [_argument] = args as [Type | object];

      key = _argument as Type;
      argument = _argument as Type;
    } else if (args.length === 2) {
      const [_key, _argument] = args as [InjectionKey, Type | InjectionFactory];
      key = _key;

      if (isClass(_argument)) {
        argument = _argument as Type;
      } else {
        argument = _argument as InjectionFactory;
      }
    } else {
      throw new RangeError('Wrong arguments number.');
    }

    return new Injection(key, argument, lifetime);
  }

  /**
   * TODO: Describe.
   *
   * @param key
   * @param type
   */
  constructor(key: InjectionKey<T>, type: Type<T>);

  /**
   * TODO: Describe.
   *
   * @param key
   * @param factory
   */
  constructor(key: InjectionKey<T>, factory: InjectionFactory<T>);

  /**
   * @inheritDoc
   */
  constructor(key: InjectionKey<T>, argument: Type<T> | InjectionFactory<T>);

  /**
   * TODO: Describe.
   *
   * @param key
   * @param type
   * @param lifetime
   */
  constructor(key: InjectionKey<T>, type: Type<T>, lifetime: InjectionLifetime);

  /**
   * TODO: Describe.
   *
   * @param key
   * @param factory
   * @param lifetime
   */
  constructor(key: InjectionKey<T>, factory: InjectionFactory<T>, lifetime: InjectionLifetime);

  /**
   * TODO: Describe.
   *
   * @param key
   * @param instance
   * @param lifetime
   */
  constructor(key: InjectionKey<T>, instance: T, lifetime: InjectionLifetime);

  /**
   * @inheritDoc
   */
  constructor(key: InjectionKey<T>, argument: Type<T> | InjectionFactory<T> | T, lifetime: InjectionLifetime);

  /**
   * @inheritDoc
   */
  constructor(key: InjectionKey<T>, argument: Type<T> | InjectionFactory<T> | T, lifetime = InjectionLifetime.Singleton) {
    this.key = key;
    this.lifetime = lifetime;

    if (isClass(argument)) {
      this.type = argument as Type<T>;
      this.parameters = Reflect.getMetadata('design:paramtypes', this.type);

      if (!Array.isArray(this.parameters)) {
        if (this.type.length > 0) {
          // TODO: Revise.
          throw new SyntaxError('Class "' + this.type.name +'" is not decorated. Try decorate it using @Injectable()');
        } else {
          this.parameters = [];
        }
      }

      this.#inject = injector => {
        return new this.type!(
          ...this.parameters!.map(
            injector.get.bind(injector)
          )
        );
      };
    } else if (typeof argument === 'function') {
      this.factory = argument as InjectionFactory<T>;
      this.#inject = this.factory;
    } else if (Type.is('object', argument)) { // TODO: Mind whether object is the only type for instance.
      if (lifetime !== InjectionLifetime.Singleton) {
        throw new TypeError('Unable to bind instance as non-singleton service.');
      }

      this.#instance = argument as T;
      this.#inject = () => this.#instance!;
    } else {
      throw new TypeError('Unsupported implementor type.');
    }

    if (InjectionLifetime.Singleton === lifetime) {
      const inject = this.#inject;

      this.#inject = injector => {
        if (this.#instance === null) {
          this.#instance = inject(injector);
        }

        return this.#instance;
      }
    }
  }

  /**
   * Provides service.
   *
   * @param injector
   */
  get(injector: Injector): T {
    return this.#inject(injector);
  }

  /**
   * TODO: Describe.
   */
  [Symbol.dispose]() {
    Disposable.dispose(this.#instance);
    this.#instance = null;
  }
}
