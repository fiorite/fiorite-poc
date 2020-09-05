import { inspectServiceKey, ServiceKey } from './service_key';
import { Collection, HashMap, HashMapError, Stack } from '../collections';
import { Provider } from './provider';
import { Callable, Disposable, InvalidOperationError, tryDispose } from '../types';

export interface Inject {
  <T>(key: ServiceKey<T>): T;
}

export interface Injector {
  <T>(key: ServiceKey<T>): T;
}

export class Injector extends Callable<Inject> {
  /**
   * Tracks key dependencies to prevent circular dependency.
   *
   * @protected
   */
  private _callStack: Stack<Provider>;

  constructor(readonly providers: Collection<Provider>) {
    super(type => this.get(type));
    this._callStack = new Stack<Provider>();
  }

  /**
   * @param provider
   * @param providerInjector uses as Provider#provide(Injector) argument.
   */
  resolve<T>(provider: Provider<T>, providerInjector: Injector = this): T {
    if (this._callStack.includes(provider)) {
      // TODO: Add key to string.
      const path = [...this._callStack.append(provider).map(x => inspectServiceKey(x.key))].join(' > ');
      throw new InvalidOperationError('Circular dependency detected: ' + path);
    }

    if (!this._callStack.empty) {
      const previous = this._callStack.peek();

      // TODO: Add #compare method.
      if (previous.lifetime.value < provider.lifetime.value) {
        // TODO: Add better error.
        throw new InvalidOperationError('Lifetime, dude');
      }
    }

    try {
      this._callStack.push(provider);

      return provider.provide(providerInjector) as T;
    } catch (error) {
      if (error instanceof HashMapError) {
        error = new InvalidOperationError(
          'Provider with key "' + ((error.key as any).name || error.key) + '" is not bound. Try add it.'
        );
      }

      throw error;
    } finally {
      this._callStack.pop();
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
   * Gets first service by specified key.
   *
   * @param key
   *
   * @throws InvalidOperationError service with a type is not bound or there is more than one service with the same key.
   */
  tryGet<T>(key: ServiceKey<T>): T | null {
    return this.resolve(
      this.providers.single(x => key === x.key) as Provider<T>,
    );
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
  private _instances: HashMap<Provider, unknown>;

  /**
   * Stores original injector.
   *
   * @private
   */
  private readonly _injector: Injector;

  constructor(injector: Injector) {
    super(injector.providers);

    this._injector = injector;
    this._instances = new HashMap<Provider, unknown>();
  }

  resolve<T>(provider: Provider<T>, providerInjector: Injector = this): T {
    if (provider.lifetime.isScoped) {
      if (!this._instances.has(provider)) {
        const service = this._injector.resolve(provider, providerInjector);
        this._instances.set(provider, service);
      }

      return this._instances.get(provider) as T;
    }

    return this._injector.resolve(provider, providerInjector);
  }

  async [Symbol.dispose]() {
    await Promise.all(
      this._instances.values
        .map(instance => tryDispose(instance))
    );

    this._instances.clear();
  }
}
