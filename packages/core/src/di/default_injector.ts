import { Collection, HashMap, HashMapError, Queue, Stack } from '../collections';
import { Disposable } from '../common';
import { InvalidOperationError } from '../errors';
import { Injector } from './injector';
import { ServiceKey } from './service_key';
import { ProviderDescriptor } from './provider_descriptor';

export class DefaultInjector extends Injector {
  /**
   * Provides associative injection mapping.
   *
   * @private
   */
  #providers: Collection<ProviderDescriptor>;

  /**
   * Stores scoped instances.
   *
   * @private
   */
  #scoped: HashMap<ProviderDescriptor, unknown>;

  /**
   * Stores disposable instances.
   *
   * @private
   */
  #disposable: Queue<Disposable>;

  /**
   * Tracks key dependencies to prevent circular dependency.
   *
   * @protected
   */
  #callStack: Stack<ProviderDescriptor>;

  constructor(providers: Collection<ProviderDescriptor>) {
    super();

    this.#providers = providers;
    this.#scoped = new HashMap<ProviderDescriptor, unknown>();
    this.#disposable = new Queue<Disposable>();
    this.#callStack = new Stack<ProviderDescriptor>();
  }

  protected provide<T>(key: ServiceKey<T> | ProviderDescriptor): Collection<T> {
    let providers = this.#providers;

    if (key instanceof ProviderDescriptor) {
      providers = providers.filter(provider => provider === key);
    } else {
      providers = providers.filter(provider => provider.key === key);
    }

    return providers.map(provider => {
      if (this.#scoped.has(provider)) {
        return this.#scoped.get(provider) as T;
      }

      if (this.#callStack.some(x => key === x.key)) {
        // TODO: Add key to string.
        const path = [...this.#callStack.map(x => x.key), key].map(x => (x as any).name || x).join(' > ');
        throw new InvalidOperationError('Circular dependency detected: ' + path);
      }

      if (!this.#callStack.empty) {
        const previous = this.#callStack.peek();

        // TODO: Add some kind of helper.
        if (previous.lifetime.value < provider.lifetime.value) {
          // TODO: Add better error.
          throw new InvalidOperationError('Lifetime, dude: TODO');
        }
      }

      try {
        this.#callStack.push(provider);

        const instance = provider.provide(this) as T;

        if (provider.lifetime.isScoped) {
          this.#scoped.set(provider, instance);
        }

        if (Disposable.implemented(instance) && !provider.lifetime.isSingleton) {
          // TODO: Mind about capacity (memory issue).
          this.#disposable.enqueue(Disposable.cast(instance));
        }

        return instance;
      } catch (error) {
        if (error instanceof HashMapError) {
          error = new InvalidOperationError(
            'Provider with key "' + ((key as any).name || key) + '" is not mapped yet. Try add it first.'
          );
        }

        throw error;
      } finally {
        this.#callStack.pop();
      }
    });
  }

  /**
   * Clears scoped cache and calls [Symbol.dispose]() on every disposable service.
   */
  async [Symbol.dispose]() {
    while (!this.#disposable.empty) {
      await this.#disposable.dequeue()[Symbol.dispose]();
    }

    this.#scoped.clear();
  }
}
