import { Collection } from '../collections';
import { Injection } from './injection';
import { Cloneable, EqualityComparer, Type } from '../common';
import { InjectionLifetime } from './lifetime';
import { InjectionFactory, providerRegistry } from './decorators';
import { InjectionKey } from './key';
import { Injector } from './injector';

export class InjectorBuilder extends Collection<Injection> implements Cloneable {
  private _buffer: Injection[] = [];

  get keys(): Collection<InjectionKey> {
    return this.map(x => x.key);
  }

  add(provider: Injection | Type): this {
    if (Type.is('class', provider)) {
      const type = provider as Type;
      provider = new Injection(
        type,
        type,
        providerRegistry.tryGet(type, InjectionLifetime.Singleton),
      );
    }

    if (provider instanceof Injection) {
      this._buffer.push(provider);
    } else {
      throw new TypeError();
    }

    return this;
  }

  addAll(iterable: Iterable<Injection | Type>): this {
    const iterator = iterable[Symbol.iterator]();

    let result = iterator.next();

    while (!result.done) {
      this.add(result.value);

      result = iterator.next();
    }

    return this;
  }

  addSingleton<T>(type: Type<T>): this;
  addSingleton(instance: object): this;
  addSingleton<T>(key: InjectionKey<T>, type: Type<T>): this;
  addSingleton<T>(key: InjectionKey<T>, factory: InjectionFactory<T>): this;
  addSingleton<T extends object>(key: InjectionKey<T>, instance: T): this;

  /**
   * @inheritDoc
   */
  addSingleton(...args: unknown[]): this {
    let provider: Injection;

    if (args.length === 1) {
      provider = Injection.singleton(...args as [Type | object]);
    } else if (args.length === 2) {
      provider = Injection.singleton(...args as [InjectionKey, Type | InjectionFactory | object]);
    } else {
      throw new RangeError('Wrong arguments number.');
    }

    return this.add(provider);
  }

  addScoped<T>(type: Type<T>): this;
  addScoped<T>(key: InjectionKey<T>, type: Type<T>): this;
  addScoped<T>(key: InjectionKey<T>, factory: InjectionFactory<T>): this;

  /**
   * @inheritDoc
   */
  addScoped(...args: unknown[]): this {
    let provider: Injection;

    if (args.length === 1) {
      provider = Injection.scoped(...args as [Type]);
    } else if (args.length === 2) {
      provider = Injection.scoped(...args as [InjectionKey, Type | InjectionFactory]);
    } else {
      throw new RangeError('Wrong arguments number.');
    }

    return this.add(provider);
  }

  addTransient<T>(type: Type<T>): this;
  addTransient<T>(key: InjectionKey<T>, type: Type<T>): this;
  addTransient<T>(key: InjectionKey<T>, factory: InjectionFactory<T>): this;

  /**
   * @inheritDoc
   */
  addTransient(...args: unknown[]): this {
    let provider: Injection;

    if (args.length === 1) {
      provider = Injection.transient(...args as [Type]);
    } else if (args.length === 2) {
      provider = Injection.transient(...args as [InjectionKey, Type | InjectionFactory]);
    } else {
      throw new RangeError('Wrong arguments number.');
    }

    return this.add(provider);
  }

  build(): Injector;
  build(comparer: EqualityComparer<InjectionKey>): Injector;
  build(comparer: EqualityComparer<InjectionKey> = EqualityComparer.DEFAULT): Injector {
    return Injector.create(this, comparer);
  }

  [Symbol.clone](): InjectorBuilder {
    const clone = Object.create(this) as this;

    clone._buffer = this._buffer.slice();

    return clone;
  }

  [Symbol.iterator]() {
    return this._buffer[Symbol.iterator]();
  }
}
