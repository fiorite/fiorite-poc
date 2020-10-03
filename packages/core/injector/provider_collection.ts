import { Cloneable, Disposable, Instance, InvalidOperationError, tryDispose, Type } from '../functional_types';
import { forEach } from '../operators';
import { Collection, proxyIterable } from '../collections';
import { ServiceKey } from './service_key';
import { ServiceLifetime } from './service_lifetime';
import { ServiceFactory } from './service_factory';
import { PartialProviderTuple, Provider, ProviderTuple, ScopedTuple, SingletonTuple, TransientTuple } from './provider';

/**
 * Provider collection that encapsulates factory methods for the easiest provider configuration.
 */
export class ProviderCollection extends Collection<Provider> implements Cloneable, Disposable {
  private _buffer: Provider[] = [];

  get size(): number {
    return this._buffer.length;
  }

  constructor(iterable: Iterable<Provider> = []) {
    super(proxyIterable(() => this._buffer));

    this.addAll(iterable);
  }

  /**
   * Adds provider to collection.
   *
   * @param provider
   */
  add(provider: Provider): this;

  /**
   * Creates provider using tuple signature and adds it to collection.
   *
   * @param tuple
   */
  add(tuple: ProviderTuple): this;

  /**
   * Creates provider with specified type and adds it to collection.
   *
   * @param type
   */
  add(type: Type): this;

  /**
   * Creates provider with specified type and adds it to collection.
   *
   * @param type
   */
  add(type: object): this;

  /**
   * Creates provider with specified type, lifetime and adds it to collection.
   *
   * @param type
   * @param lifetime
   */
  add(type: Type, lifetime: ServiceLifetime): this

  add<T>(key: ServiceKey<T>, factory: ServiceFactory<T>): this;
  /**
   * Creates provider with specified type
   *
   * @param key
   * @param type
   */
  add<T>(key: ServiceKey<T>, type: Type<T>): this;
  add<T extends object>(key: ServiceKey<T>, instance: T): this;
  add<T>(key: ServiceKey<T>, type: Type<T>, lifetime: ServiceLifetime): this;

  add<T>(key: ServiceKey<T>, factory: ServiceFactory<T>, lifetime: ServiceLifetime): this;
  add<T>(key: ServiceKey<T>, ...partial: PartialProviderTuple<T>): this;
  add(...args: any[]): this {
    let provider: Provider;

    if (args.length === 1 && args[0] instanceof Provider) {
      provider = args[0];
    } else if (args.length === 1 && Array.isArray(args[0])) {
      provider = provider = new Provider(...args[0] as ProviderTuple);
    } else {
      provider = new Provider(...args as ProviderTuple);
    }

    if (this.has(provider)) {
      throw new InvalidOperationError(); // TODO: Add readable message.
    }

    this._buffer.push(provider);

    return this;
  }

  addAll(iterable: Iterable<Provider | ProviderTuple | Type | object>): this {
    forEach(element => this.add(element as any))(iterable);

    return this;
  }

  addSingleton(type: Type): this;
  addSingleton(provider: SingletonTuple): this;
  addSingleton(instance: Instance): this;
  addSingleton<T>(key: ServiceKey<T>, type: Type<T>): this;
  addSingleton<T>(key: ServiceKey<T>, factory: ServiceFactory<T>): this;
  addSingleton<T>(key: ServiceKey<T>, instance: T): this;
  addSingleton(...args: any[]): this {
    let provider: Provider;

    if (args.length === 1 && Array.isArray(args[0])) {
      provider = Provider.singleton(...args[0] as SingletonTuple);
    } else {
      provider = Provider.singleton(...args as SingletonTuple);
    }

    return this.add(provider);
  }

  addAllSingleton(iterable: Iterable<SingletonTuple | Type>): this {
    forEach(element => this.addSingleton(element as any))(iterable);

    return this;
  }

  addScoped(type: Type): this;
  addScoped(tuple: ScopedTuple): this;
  addScoped<T>(key: ServiceKey<T>, type: Type<T>): this;
  addScoped<T>(key: ServiceKey<T>, factory: ServiceFactory<T>): this;
  addScoped(...args: ScopedTuple | [ScopedTuple]): this {
    let provider: Provider;

    if (args.length === 1 && Array.isArray(args[0])) {
      provider = Provider.scoped(...args[0] as ScopedTuple);
    } else {
      provider = Provider.scoped(...args as ScopedTuple);
    }

    return this.add(provider);
  }

  addAllScoped(iterable: Iterable<Type | ScopedTuple>): this {
    forEach<Type | ScopedTuple>(element => this.addScoped(element as any))(iterable); // TODO: Make it compatible.

    return this;
  }

  addTransient(type: Type): this;
  addTransient(tuple: TransientTuple): this;
  addTransient<T>(key: ServiceKey<T>, type: Type<T>): this;
  addTransient<T>(key: ServiceKey<T>, factory: ServiceFactory<T>): this;
  addTransient(...args: TransientTuple | [TransientTuple]): this {
    let provider: Provider;

    if (args.length === 1 && Array.isArray(args[0])) {
      provider = Provider.transient(...args[0] as TransientTuple);
    } else {
      provider = Provider.transient(...args as TransientTuple);
    }

    return this.add(provider);
  }

  addAllTransient(iterable: Iterable<Type | TransientTuple>): this {
    forEach(element => this.addTransient(element as any))(iterable); // TODO: Make it compatible.

    return this;
  }

  /**
   * Checks whether specified provider exists in a collection.
   *
   * @param provider
   */
  has(provider: Provider): boolean {
    return this.some(x => x[Symbol.equals](provider));
  }

  /**
   * Checks whether at least one provider with specified key exists.
   *
   * @param key
   */
  hasKey(key: ServiceKey): boolean {
    return this.some(x => key === x.key);
  }

  /**
   * Clones provider collection.
   */
  [Symbol.clone](): ProviderCollection {
    const instance = Object.create(this) as ProviderCollection;

    instance._buffer = this._buffer.slice();

    return instance;
  }

  /**
   * Disposes all singleton providers.
   */
  async [Symbol.dispose]() {
    await Promise.all(
      this.filter(provider => null !== provider.instance)
        .map(provider => tryDispose(provider.instance)),
    );
  }

  /**
   * Returns provider iterator.
   */
  [Symbol.iterator]() {
    return this._buffer.values();
  }
}
