import { inspectServiceKey, ServiceKey } from './service_key';
import { Collection, HashMap, HashMapError, Stack } from '../collections';
import { Provider } from './provider';
import { InvalidOperationError } from '../errors';
import { Disposable, tryDispose } from '../common';

export class Injector {
  /**
   * Tracks key dependencies to prevent circular dependency.
   *
   * @protected
   */
  #callStack: Stack<Provider>;

  constructor(readonly providers: Collection<Provider>) {
    this.#callStack = new Stack<Provider>();
  }

  /**
   * @param provider
   * @param providerInjector uses as Provider#provide(Injector) argument.
   */
  resolve<T>(provider: Provider<T>, providerInjector: Injector = this): T {
    if (this.#callStack.includes(provider)) {
      // TODO: Add key to string.
      const path = [...this.#callStack.append(provider).map(x => inspectServiceKey(x.key))].join(' > ');
      throw new InvalidOperationError('Circular dependency detected: ' + path);
    }

    if (!this.#callStack.empty) {
      const previous = this.#callStack.peek();

      // TODO: Add #compare method.
      if (previous.lifetime.value < provider.lifetime.value) {
        // TODO: Add better error.
        throw new InvalidOperationError('Lifetime, dude');
      }
    }

    try {
      this.#callStack.push(provider);

      return provider.provide(providerInjector) as T;
    } catch (error) {
      if (error instanceof HashMapError) {
        error = new InvalidOperationError(
          'Provider with key "' + ((error.key as any).name || error.key) + '" is not bound. Try add it.'
        );
      }

      throw error;
    } finally {
      this.#callStack.pop();
    }
  }

  /**
   * Gets first service by specified key.
   *
   * @param key
   *
   * @throws InvalidOperationError service with a type is not bound or there is more than one service with the same key.
   */
  get<T>(key: ServiceKey<T>): T {
    return this.resolve(
      this.providers.single(x => key === x.key) as Provider<T>,
    );
  }

  /**
   * Gets service collection of specified type.
   *
   * @param key
   */
  getAll<T>(key: ServiceKey<T>): Collection<T> {
    return this.providers.cast<Provider<T>>()
      .filter(x => key === x.key)
      .map(x => this.resolve(x));
  }

  /**
   * Checks whether key exists
   *
   * @param key
   */
  has(key: ServiceKey): boolean {
    return this.providers.some(provider => key === provider.key);
  }

  // TODO: Add try API.
}

export class ScopedInjector extends Injector implements Disposable {
  /**
   * Stores scoped instances.
   *
   * @private
   */
  #instances: HashMap<Provider, unknown>;

  /**
   * Stores original injector.
   *
   * @private
   */
  readonly #injector: Injector;

  constructor(injector: Injector) {
    super(injector.providers);

    this.#injector = injector;
    this.#instances = new HashMap<Provider, unknown>();
  }

  resolve<T>(provider: Provider<T>, providerInjector: Injector = this): T {
    if (provider.lifetime.isScoped) {
      if (!this.#instances.has(provider)) {
        const service = this.#injector.resolve(provider, providerInjector);
        this.#instances.set(provider, service);
      }

      return this.#instances.get(provider) as T;
    }

    return this.#injector.resolve(provider, providerInjector);
  }

  async [Symbol.dispose]() {
    await Promise.all(
      this.#instances.values
        .map(instance => tryDispose(instance))
    );

    this.#instances.clear();
  }
}
