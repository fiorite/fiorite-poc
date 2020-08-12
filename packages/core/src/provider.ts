import { Type } from './type';
import { Injector } from './injection';
import { ServiceKey, ServiceLifetime } from './service';
import { HashMap } from './hash.map';
import { Collection } from './collection';

/**
 * Specific error related to {@link Provider}.
 */
export class ProviderError extends TypeError { }

export type ProviderFactory<T = unknown> = (provider: Injector) => T;

export const providerRegistry = new HashMap<Type, ServiceLifetime>();

export const Singleton = (): ClassDecorator => {
  return target => {
    providerRegistry.add(Type.cast(target), ServiceLifetime.Singleton);
  };
};

export const Scoped = (): ClassDecorator => {
  return target => {
    providerRegistry.add(Type.cast(target), ServiceLifetime.Scoped);
  };
};

export const Transient = (): ClassDecorator => {
  return target => {
    providerRegistry.add(Type.cast(target), ServiceLifetime.Transient);
  };
};


export class Provider<T = unknown> {
  /**
   * TODO: Describes.
   */
  readonly key: ServiceKey<T>;

  /**
   * TODO: Describes.
   */
  readonly lifetime: ServiceLifetime = ServiceLifetime.Singleton

  /**
   * Stores class constructor.
   */
  private readonly _type: Type<T> |  null = null;

  /**
   * TODO: Describe.
   */
  get type() {
    return this._type;
  }

  /**
   * Stores constructor parameters.
   */
  private readonly _parameters: Type<T>[] |  null = null;

  /**
   * TODO: Describe.
   */
  get parameters() {
    return this._parameters;
  }

  /**
   * Caches singleton services.
   *
   * @private
   */
  private _instance: T | null = null;

  /**
   * TODO: Describe.
   */
  get instance() {
    return this._instance;
  }

  /**
   * TODO: Describe.
   */
  private readonly _inject: (injector: Injector) => T;

  /**
   * @param key
   * @param provider
   * @param lifetime
   */
  constructor(
    key: ServiceKey<T>,
    provider: Type<T> | ((provider: Injector) => T) | T,
    lifetime = ServiceLifetime.Singleton,
  ) {
    this.key = key;
    this.lifetime = lifetime;

    if (Type.is('class', provider)) {
      this._type = provider as Type<T>;
      this._parameters = Reflect.getMetadata('design:paramtypes', this._type);

      if (!Type.is('array', this._parameters)) {
        if (this._type.length > 0) {
          throw new ProviderError('Class "' + this._type.name +'" is not decorated. Try decorate it using @Injectable()');
        } else {
          this._parameters = [];
        }
      }

      this._inject = _provider => {
        return new this._type!(
          ...this._parameters!.map(
            _provider.get.bind(_provider)
          )
        );
      };
    } else if (Type.is('function', provider)) {
      this._inject = provider as (provider: Injector) => T;
    } else if (Type.is('object', provider)) {
      if (lifetime !== ServiceLifetime.Singleton) {
        throw new TypeError('Unable to bind instance as non-singleton service.');
      }

      this._instance = provider as T;
      this._inject = () => this._instance!;
    } else {
      throw new ProviderError('Unsupported implementor type.');
    }

    if (ServiceLifetime.Singleton === lifetime) {
      const provide = this._inject;

      this._inject = provider => {
        if (this._instance === null) {
          this._instance = provide(provider);
        }

        return this._instance;
      }
    }
  }

  /**
   * Provides service.
   *
   * @param provider
   */
  inject(provider: Injector): T {
    return this._inject(provider);
  }
}
