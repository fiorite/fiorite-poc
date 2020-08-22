import { ServiceKey } from './service_key';
import { Collection } from '../collections';
import { Callable, Disposable, PromiseOr } from '../common';
import { ProviderDescriptor } from './provider_descriptor';
import { InvalidOperationError } from '../errors';

export interface Injector extends Function {
  /**
   * Inject all services with a key.
   *
   * @param key
   */
  <T>(key: ServiceKey<T> | ProviderDescriptor<T>): Collection<T>;
}

export type InjectorFunction = <T>(key: ServiceKey<T> | ProviderDescriptor<T>) => Collection<T>;

export abstract class Injector extends Callable<InjectorFunction> implements Disposable {
  protected constructor() {
    super(key => this.provide(key));
  }

  /**
   * Provides service collection with a key.
   *
   * @param key
   * @protected
   */
  protected abstract provide<T>(key: ServiceKey<T> | ProviderDescriptor<T>): Collection<T>;

  /**
   * Gets a single instance with a key.
   *
   * @param key
   *
   * @throws InvalidOperationError if there is no services or more than one service registered with the same key.
   */
  get<T>(key: ServiceKey<T> | ProviderDescriptor<T>): T {
    try {
      return this(key).single();
    } catch (error) {
      if (error instanceof InvalidOperationError) {
        throw new Error('Unable to locate "' + key.toString() + '"');
      }

      throw error;
    }
  }

  /**
   * Gets all instances with a key.
   *
   * @param key
   */
  getAll<T>(key: ServiceKey<T>): Collection<T> {
    return this(key);
  }

  /**
   * Checks whether at least one instance with a key registered.
   *
   * @param key
   */
  has(key: ServiceKey): boolean {
    return this(key).some();
  }

  /**
   * Gets a single service with key or null if there is no such service.
   *
   * @param key
   *
   * @throws InvalidOperationError if more than one service registered with the same key.
   */
  tryGet<T>(key: ServiceKey<T>): T | null;

  /**
   * Gets a single service with key or {@param or} if there is no such service.
   *
   * @param key
   * @param or
   *
   * @throws InvalidOperationError if more than one service registered with the same key.
   */
  tryGet<T>(key: ServiceKey<T>, or: T): T;

  /**
   * @inheritDoc
   */
  tryGet<T>(key: ServiceKey<T>, or: T | null = null): T | null {
    return this(key).trySingle() || or;
  }

  abstract [Symbol.dispose](): PromiseOr<void>;
}

