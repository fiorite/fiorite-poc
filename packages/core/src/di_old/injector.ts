import 'reflect-metadata';

import { Collection, HashMap, HashMapError, Queue, Stack } from '../collections';
import { Cloneable, Disposable, EqualityComparer, inspectSymbol } from '../common';
import { Injection } from './injection';
import { InjectionKey } from './key';
import { InjectionLifetime } from './lifetime';
import { InvalidOperationError } from '../errors';

/**
 * Specific error related to {@link DefaultInjector}.
 */
export class InjectorError extends TypeError { }

export abstract class Injector extends Collection<InjectionKey> implements Cloneable, Disposable {
  get [Symbol.toStringTag]() {
    return 'Injector';
  }

  static create(providers: Iterable<Injection>, comparer: EqualityComparer<InjectionKey> = EqualityComparer.DEFAULT) {
    return new DefaultInjector(providers, comparer);
  }

  /**
   * @param key
   *
   * @throws InvalidOperationError key is not bound.
   * @throws InjectorError provider lifetime is incorrect.
   */
  abstract get<T>(key: InjectionKey<T>): T;

  /**
   * Checks whether provider with key is bound.
   *
   * @param key
   */
  has(key: InjectionKey): boolean {
    // TODO: Think about comparer usage.
    return this.some(x => x === key);
  }

  /**
   * Gets service by key and return null when provider is not bound.
   *
   * @param key
   */
  tryGet<T>(key: InjectionKey<T>): T | null {
    try {
      return this.get(key);
    } catch (error) {
      if (error instanceof InvalidOperationError) {
        return null;
      }

      throw error;
    }
  }

  abstract [Symbol.dispose](): void;

  abstract [Symbol.clone](): Injector;
}

export class DefaultInjector extends Injector implements Cloneable, Disposable {
  /**
   * Provides associative injection mapping.
   *
   * @private
   */
  #injection = new HashMap<InjectionKey, Injection>();

  /**
   * Stores scoped instances.
   *
   * @private
   */
  #instances: HashMap<InjectionKey, unknown>;

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
  #callStack: Stack<InjectionKey>;

  get size() {
    return this.#injection.size;
  }

  constructor(injections: Iterable<Injection>, comparer: EqualityComparer<InjectionKey> = EqualityComparer.DEFAULT) {
    super();

    try {
      this.#injection = HashMap.from(injections, x => x.key, x => x, comparer)
    } catch (error) {
      if (error instanceof HashMapError) {
        const key = error.key as InjectionKey;
        error = new InjectorError('Injection with key "' + (key.name || key) + '" is not unique. Try remove duplicates.');
      }

      throw error;
    }

    // try {
    //   this._providers = HashMap.from(descriptors, x => x.key, x => x, comparer);
    // } catch (error) {
    //   if (error instanceof HashMapError) {
    //     const key = error.key as ServiceKey;
    //     error = new ProviderError('Injection with key "' + key.name + '" is not unique. Try remove duplicates.');
    //   }
    //
    //   throw error;
    // }

    const self = Injection.singleton(Injector, this);
    this.#injection.set(Injector, self);

    this.#instances = new HashMap<InjectionKey, unknown>([], comparer);
    this.#callStack = new Stack<InjectionKey>([], comparer);
    this.#disposable = new Queue<Disposable>([]);
  }

  /**
   * Gets service that is associated with provided key.
   *
   * @param key
   */
  get<T>(key: InjectionKey<T>): T {
    if (this.#instances.has(key)) {
      return this.#instances.get(key) as T;
    }

    if (this.#callStack.has(key)) {
      const path = [...this.#callStack, key].map(x => x.name).join(' > ');
      throw new InjectorError('Circular dependency detected: ' + path);
    }

    if (!this.#callStack.empty) {
      const previous = this.#injection.get(
        this.#callStack.peek(),
      );

      if (previous.lifetime < this.#injection.get(key).lifetime) {
        // TODO: Add better error.
        throw new InjectorError('Lifetime, dude: TODO');
      }
    }

    try {
      this.#callStack.push(key);

      const provider = this.#injection.get(key);
      const instance = provider.get(this) as T;

      if (provider.lifetime === InjectionLifetime.Scoped) {
        this.#instances.set(key, instance);
      }

      if (Disposable.implemented(instance) && provider.lifetime !== InjectionLifetime.Singleton) {
        // TODO: Mind about capacity (memory issue).
        this.#disposable.enqueue(Disposable.cast(instance));
      }

      // if (provider.lifetime === ServiceLifetime.Transient && typeof instance === 'object') {
      //   this._transient.add(instance as unknown as object);
      // }

      return instance;
    } catch (error) {
      if (error instanceof HashMapError) {
        error = new InjectorError(
          'Injection with key "' + key.name + '" is not mapped yet. Try add it first.'
        );
      }

      throw error;
    } finally {
      this.#callStack.pop();
    }
  }

  /**
   * Checks whether injection with key exists.
   *
   * @param key
   */
  has(key: InjectionKey): boolean {
    return this.#injection.has(key);
  }

  /**
   * @inheritDoc
   */
  [Symbol.dispose](): void {
    const disposable = this.#disposable;

    while (!disposable.empty) {
      disposable.dequeue()[Symbol.dispose]();
    }

    this.#instances.clear();
  }

  [Symbol.clone](): DefaultInjector {
    const clone = Object.create(this) as this;

    clone.#injection = this.#injection[Symbol.clone]();
    clone.#callStack = new Stack<InjectionKey>();
    clone.#instances = new HashMap<InjectionKey, unknown>();
    clone.#disposable = new Queue<Disposable>();

    return clone;
  }

  /**
   * Return keys iterator of instantiated services.
   */
  [Symbol.iterator](): Iterator<InjectionKey> {
    return this.#injection.keys[Symbol.iterator]();
  }

  // [inspectSymbol]() {
  //   return `${this[Symbol.toStringTag]}(${this.count()}) [ ${this.#injection.keys.map(InjectionKey.toString).toArray().join(', ')} ]`;
  // }
}
