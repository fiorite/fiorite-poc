import { Cloneable, Disposable, tryDispose, Type } from '../common';
import { forEach } from '../operators';
import { Collection } from '../collections';
import { ServiceKey } from './service_key';
import { ServiceLifetime } from './service_lifetime';
import { ServiceFactory } from './service_factory';
import { InvalidOperationError } from '../errors';
import {
  Provider,
  ProviderTuple,
  ScopedTuple,
  SingletonTuple,
  TransientTuple
} from './provider';

/**
 * Provider collection that encapsulates factory methods for the easiest provider configuration.
 */
export class ProviderCollection extends Collection<Provider> implements Cloneable, Disposable {
  #buffer: Provider[] = [];

  get size(): number {
    return this.#buffer.length;
  }

  constructor(iterable: Iterable<Provider> = []) {
    super();
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
   * Creates provider with specified type, lifetime and adds it to collection.
   *
   * @param type
   * @param lifetime
   */
  add(type: Type, lifetime: ServiceLifetime): this

  /**
   * Creates provider with specified type
   *
   * @param key
   * @param type
   */
  add<T>(key: ServiceKey<T>, type: Type<T>): this;
  add<T>(key: ServiceKey<T>, factory: ServiceFactory<T>): this;
  add<T extends object>(key: ServiceKey<T>, instance: T): this;
  add<T>(key: ServiceKey<T>, type: Type<T>, lifetime: ServiceLifetime): this;
  add<T>(key: ServiceKey<T>, factory: ServiceFactory<T>, lifetime: ServiceLifetime): this;
  add(...args: [Provider | ProviderTuple] | ProviderTuple): this {
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

    this.#buffer.push(provider);

    return this;
  }

  addAll(iterable: Iterable<Provider | ProviderTuple | Type>): this {
    forEach(iterable, element => this.add(element as any));

    return this;
  }

  addSingleton(type: Type): this;
  addSingleton(provider: SingletonTuple): this;
  addSingleton<T>(key: ServiceKey<T>, type: Type<T>): this;
  addSingleton<T>(key: ServiceKey<T>, factory: ServiceFactory<T>): this;
  addSingleton<T extends object>(key: ServiceKey<T>, instance: T): this;
  addSingleton(...args: SingletonTuple | [SingletonTuple]): this {
    let provider: Provider;

    if (args.length === 1 && Array.isArray(args[0])) {
      provider = Provider.singleton(...args[0] as SingletonTuple);
    } else {
      provider = Provider.singleton(...args as SingletonTuple);
    }

    return this.add(provider);
  }

  addAllSingleton(iterable: Iterable<SingletonTuple | Type>): this {
    forEach(iterable, element => this.addSingleton(element as any));

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
    forEach(iterable, element => this.addScoped(element as any)); // TODO: Make it compatible.

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
    forEach(iterable, element => this.addTransient(element as any)); // TODO: Make it compatible.

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

    instance.#buffer = this.#buffer.slice();

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
    return this.#buffer[Symbol.iterator]();
  }
}
