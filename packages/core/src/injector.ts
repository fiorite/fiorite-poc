import 'reflect-metadata';

import { HashMap, HashMapError } from './hash.map';
import { Disposable } from './disposable';
import { Collection } from './collection';
import { AbstractType, Type } from './type';
import { HashSet } from './hash.set';
import { Stack } from './stack';
import { EqualityComparer } from './equality-comparer';
import { Selector } from './selector';

/**
 * Represents service key.
 */
export type InjectorKey<T = unknown> = Type<T> | AbstractType<T>;

/**
 * Specific error related to {@link Injection}.
 */
export class InjectionError extends TypeError { }

export function Injectable(): ClassDecorator {
  return () => void 0;
}

export function Inject(): ParameterDecorator;
export function Inject<T>(key: InjectorKey<T>): ParameterDecorator;
export function Inject<T, R>(key: InjectorKey<T>, selector: Selector<T, R>): ParameterDecorator;
export function Inject<T, R>(key?: InjectorKey<T>, selector?: Selector<T, R>): ParameterDecorator {
  return () => void 0;
}

export abstract class Injection<T = unknown> {
  /**
   * @param key
   * @protected
   */
  protected constructor(readonly key: InjectorKey<T>) { }

  /**
   * Instantiates service.
   *
   * @param injector
   */
  abstract create(injector: Injector): T;
}

export class InstanceInjection<T> extends Injection<T> {
  constructor(key: InjectorKey<T>, readonly instance: T) {
    super(key);
  }

  /**
   * Returns already instantiated service.
   */
  create() {
    return this.instance;
  }
}

export class ReferenceInjection<T> extends Injection<T> {
  constructor(key: InjectorKey<T>, readonly reference: InjectorKey<T>) {
    super(key);
  }

  /**
   * Returns already instantiated service.
   */
  create(injector: Injector) {
    return injector.get(this.reference);
  }
}

export class FactoryInjection<T> extends Injection<T> {
  constructor(key: InjectorKey<T>, readonly factory: (injector: Injector) => T) {
    super(key);
  }

  /**
   * Creates instance using factory function.
   *
   * @param injector
   */
  create(injector: Injector) {
    return this.factory(injector);
  }
}

export class ReflectInjection<T> extends Injection<T> {
  /**
   * Stores class constructor.
   */
  readonly type: Type<T>;

  /**
   * Stores parameter types.
   */
  readonly params: readonly Type[];

  constructor(type: Type<T>);
  constructor(key: InjectorKey<T>, type: Type<T>);
  constructor(key: InjectorKey<T>, type?: Type<T>) {
    super(key);

    this.type = arguments.length < 2 ? key as Type<T> : type!;
    this.params = Reflect.getMetadata('design:paramtypes', this.type);

    if (!Type.is('array', this.params)) {
      throw new InjectionError('Class "' + this.type +'" is not decorated. Try decorate it using @Injectable()');
    }
  }

  /**
   * Creates instance using parameter types from metadata.
   *
   * @param injector
   */
  create(injector: Injector) {
    const args = this.params.map(param => injector.get(param));

    return new this.type(...args);
  }
}

/**
 * Specific error related to {@link Injector}.
 */
export class InjectorError extends TypeError { }

export abstract class Injector extends Collection<InjectorKey> implements Disposable {
  /**
   * Gets service that is associated with provided key.
   *
   * @param key
   *
   * @throws InjectorError Whether service with such key missed.
   */
  abstract get<T>(key: InjectorKey<T>): T;

  /**
   * Checks whether injection with key exists.
   *
   * @param key
   */
  abstract has(key: InjectorKey): boolean;

  /**
   * Disposes local services.
   *
   * @internal
   */
  [Symbol.dispose](): void { }

  /**
   * Return keys iterator of instantiated services.
   */
  abstract [Symbol.iterator](): Iterator<InjectorKey>;
}

export class DefaultInjector extends Injector {
  /**
   * Provides associative injection mapping.
   *
   * @private
   */
  private injection = new HashMap<InjectorKey, Injection>();

  /**
   * Stores instantiated services.
   *
   * @private
   */
  private instances: HashMap<InjectorKey, unknown>;

  /**
   * Tracks key dependencies to prevent circular dependency.
   *
   * @protected
   */
  protected callStack: Stack<InjectorKey>;

  constructor(injection: Iterable<Injection>, comparer = EqualityComparer.DEFAULT) {
    super();

    try {
      this.injection = HashMap.from(injection, x => x.key, x => x, comparer);
    } catch (error) {
      if (error instanceof HashMapError) {
        const key = error.key as InjectorKey;
        error = new InjectorError('Injection with key "' + key.name + '" is not unique. Try remove duplicates.');
      }

      throw error;
    }

    this.injection.set(Injector, new InstanceInjection(Injector, this));

    this.instances = new HashMap<InjectorKey, unknown>([], comparer);
    this.callStack = new Stack<InjectorKey>([], comparer);
  }

  /**
   * Encapsulates creation logic.
   *
   * @param key
   * @param injector
   * @private
   */
  protected inject<T>(key: InjectorKey, injector: Injector): T {
    try {
      return this.injection.get(key).create(injector) as T;
    } catch (error) {
      if (error instanceof HashMapError) {
        error = new InjectorError('Injection with key "' + key.name + '" is not mapped yet. Try add it first.');
      }

      throw error;
    }
  }

  /**
   * Gets service that is associated with provided key.
   *
   * @param key
   */
  get<T>(key: InjectorKey<T>): T {
    if (this.instances.has(key)) {
      return this.instances.get(key) as T;
    }

    if (this.callStack.has(key)) {
      const path = [...this.callStack, key].map(x => x.name).join(' > ');
      throw new InjectorError('Circular dependency detected: ' + path);
    }

    this.callStack.push(key);

    const instance = this.inject<T>(key, this);

    this.callStack.pop();

    return instance;
  }

  /**
   * Checks whether injection with key exists.
   *
   * @param key
   */
  has(key: InjectorKey): boolean {
    return this.injection.has(key);
  }

  /**
   * @inheritDoc
   */
  [Symbol.dispose](): void {
    this.instances.values.cast<Disposable>()
      .filter(instance => Type.is('function', instance[Symbol.dispose]))
      .forEach(instance => instance[Symbol.dispose]());
  }

  /**
   * Return keys iterator of instantiated services.
   */
  [Symbol.iterator](): Iterator<InjectorKey> {
    return this.injection.keys[Symbol.iterator]();
  }
}

class CompositeInjector extends Injector {
  readonly injectors: HashSet<Injector>;

  constructor(injectors: Iterable<Injector>, comparer = EqualityComparer.DEFAULT) {
    super();
    this.injectors = new HashSet(injectors, comparer);
  }

  /**
   * Gets service that is associated with provided key.
   *
   * @param key
   */
  get<T>(key: InjectorKey<T>): T {
    return this.injectors.single(injector => injector.has(key)).get(key);
  }

  /**
   * Gets service that is associated with provided key.
   *
   * @param key
   */
  has<T>(key: InjectorKey<T>): boolean {
    return this.injectors.some(injector => injector.has(key));
  }

  /**
   * @inheritDoc
   */
  [Symbol.dispose](): void {
    this.injectors.forEach(injector => injector[Symbol.dispose]());
  }

  /**
   * Return keys iterator of instantiated services.
   */
  [Symbol.iterator](): Iterator<InjectorKey> {
    return this.injectors.flat()[Symbol.iterator]();
  }
}

// Test

@Injectable()
class A {
  constructor() { }
}

@Injectable()
class B {
  constructor(readonly a: A) { }
}

@Injectable()
class C {
  constructor(readonly a: A, readonly b: B, readonly c: C) { }
}

@Injectable()
class D {
  constructor() { }
}

@Injectable()
class E {
  constructor(readonly d: D, readonly injector: Injector) { }
}

const injector = new CompositeInjector([

  new DefaultInjector([
    new ReflectInjection(A),
    new ReflectInjection(B), // B { a: A {} }
    new ReflectInjection(C), // is the reason of "Circular dependency detected"
  ]),

  new DefaultInjector([
    new ReflectInjection(D),
    new ReflectInjection(E), // B { a: A {} }
  ]),

]);

console.log(
  injector.empty, // false
  injector.get(B), // B { a: A {} }
  injector.get(E), // E { d: D {}, injector: DefaultInjector {} }
  // injector.get(C), // throws "Circular dependency detected"
);

/**
 * Lifetimes:
 *
 * Singleton
 * Scoped (not request in order it might has different context)
 * Transient || Prototype
 */
