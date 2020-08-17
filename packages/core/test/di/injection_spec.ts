import { expect } from 'chai';

import { Injectable, Injection, InjectionLifetime, Injector } from '../../src/di';
import { Disposable } from '../../src/common';

describe('Injection', () => {
  describe('factory singleton()', () => {
    it('should create singleton using (Type) signature', () => {
      const injection = Injection.singleton(ClassB);

      expect(injection.lifetime).equals(InjectionLifetime.Singleton);
      expect(injection.key).equals(ClassB);
      expect(injection.factory).equals(null);
      expect(injection.type).equals(ClassB);
      expect(injection.parameters).members([ClassA]);
      expect(injection.instance).equals(null);
    });

    it('should create singleton using (object) signature', () => {
      const instance = new ClassA();
      const injection = Injection.singleton(instance);

      expect(injection.lifetime).equals(InjectionLifetime.Singleton);
      expect(injection.key).equals(ClassA);

      expect(injection.factory).equals(null);
      expect(injection.type).equals(null);
      expect(injection.parameters).equals(null);
      expect(injection.instance).equals(instance);
    });

    it('should create singleton using (InjectionKey, Type) signature', () => {
      const injection = Injection.singleton(AbstractClassB, ClassB);

      expect(injection.lifetime).equals(InjectionLifetime.Singleton);
      expect(injection.key).equals(AbstractClassB);

      expect(injection.factory).equals(null);
      expect(injection.type).equals(ClassB);
      expect(injection.parameters).members([ClassA]);
      expect(injection.instance).equals(null);
    });

    it('should create singleton using (InjectionKey, InjectionFactory) signature', () => {
      const factory = () => new ClassA();
      const injection = Injection.singleton(AbstractClassA, factory);

      expect(injection.lifetime).equals(InjectionLifetime.Singleton);
      expect(injection.key).equals(AbstractClassA);

      expect(injection.factory).equals(factory);
      expect(injection.type).equals(null);
      expect(injection.parameters).equals(null);
      expect(injection.instance).equals(null);
    });

    it('should create singleton using (InjectionKey, object) signature', () => {
      const instance = new ClassA();
      const injection = Injection.singleton(AbstractClassA, instance);

      expect(injection.lifetime).equals(InjectionLifetime.Singleton);
      expect(injection.key).equals(AbstractClassA);

      expect(injection.factory).equals(null);
      expect(injection.type).equals(null);
      expect(injection.parameters).equals(null);
      expect(injection.instance).equals(instance);
    });
  });

  describe('factory scoped()', () => {
    it('should create scoped using (Type) signature', () => {
      const injection = Injection.scoped(ClassB);

      expect(injection.lifetime).equals(InjectionLifetime.Scoped);
      expect(injection.key).equals(ClassB);

      expect(injection.factory).equals(null);
      expect(injection.type).equals(ClassB);
      expect(injection.parameters).members([ClassA]);
      expect(injection.instance).equals(null);
    });

    it('should create scoped using (InjectionKey, Type) signature', () => {
      const injection = Injection.scoped(AbstractClassB, ClassB);

      expect(injection.lifetime).equals(InjectionLifetime.Scoped);
      expect(injection.key).equals(AbstractClassB);

      expect(injection.factory).equals(null);
      expect(injection.type).equals(ClassB);
      expect(injection.parameters).members([ClassA]);
      expect(injection.instance).equals(null);
    });

    it('should create scoped using (InjectionKey, InjectionFactory) signature', () => {
      const factory = () => new ClassA();
      const injection = Injection.scoped(AbstractClassA, factory);

      expect(injection.lifetime).equals(InjectionLifetime.Scoped);
      expect(injection.key).equals(AbstractClassA);

      expect(injection.factory).equals(factory);
      expect(injection.type).equals(null);
      expect(injection.parameters).equals(null);
      expect(injection.instance).equals(null);
    });
  });

  describe('factory transient()', () => {
    it('should create transient using (Type) signature', () => {
      const injection = Injection.transient(ClassB);

      expect(injection.lifetime).equals(InjectionLifetime.Transient);
      expect(injection.key).equals(ClassB);

      expect(injection.factory).equals(null);
      expect(injection.type).equals(ClassB);
      expect(injection.parameters).members([ClassA]);
      expect(injection.instance).equals(null);
    });

    it('should create transient using (InjectionKey, Type) signature', () => {
      const injection = Injection.transient(AbstractClassB, ClassB);

      expect(injection.lifetime).equals(InjectionLifetime.Transient);
      expect(injection.key).equals(AbstractClassB);

      expect(injection.factory).equals(null);
      expect(injection.type).equals(ClassB);
      expect(injection.parameters).members([ClassA]);
      expect(injection.instance).equals(null);
    });

    it('should create transient using (InjectionKey, InjectionFactory) signature', () => {
      const factory = () => new ClassA();
      const injection = Injection.transient(AbstractClassA, factory);

      expect(injection.lifetime).equals(InjectionLifetime.Transient);
      expect(injection.key).equals(AbstractClassA);

      expect(injection.factory).equals(factory);
      expect(injection.type).equals(null);
      expect(injection.parameters).equals(null);
      expect(injection.instance).equals(null);
    });
  });

  describe('#constructor()', () => {
    // TODO: Add tests.
  });

  describe('#get()', () => {
    const injector = Injector.create([]);

    it('should get singleton using (Type) signature', () => {
      const injection = Injection.singleton(ClassA);
      expect(injection.instance).equals(null);

      const instance = injection.get(injector);

      expect(instance).instanceOf(ClassA);
      expect(instance).equals(injection.instance);
      expect(instance).equals(injection.get(injector));
    });

    it('should get singleton using (object) signature', () => {
      const instance = new ClassA();
      const injection = Injection.singleton(instance);
      expect(injection.instance).equals(instance);

      const result = injection.get(injector);

      expect(result).equals(injection.instance);
      expect(result).equals(injection.get(injector));
    });

    it('should get scoped (new instance)', () => {
      const injection = Injection.scoped(ClassA);
      const instance = injection.get(injector);

      expect(instance).instanceOf(ClassA);
      expect(injection.instance).equals(null);
      expect(instance).not.equals(injection.get(injector));
    });

    it('should get transient (new instance)', () => {
      const injection = Injection.transient(ClassA);
      const instance = injection.get(injector);

      expect(instance).instanceOf(ClassA);
      expect(injection.instance).equals(null);
      expect(instance).not.equals(injection.get(injector));
    });
  });

  describe('#[Symbol.dispose]()', () => {
    it('should dispose singleton provider with initial instance', () => {
      const instance = new ClassA();
      expect(instance.disposed).equals(false);

      const injection = Injection.singleton(instance);

      injection[Symbol.dispose]();
      expect(instance.disposed).equals(true);
    });
  });
});

abstract class AbstractClassA { }

@Injectable()
class ClassA extends AbstractClassA implements Disposable {
  disposed = false;

  [Symbol.dispose]() {
    if (this.disposed) {
      throw new TypeError('Instance is already disposed.');
    }

    this.disposed = true;
  }
}

class AbstractClassB {
  constructor(
    readonly a: AbstractClassA
  ) { }
}

@Injectable()
class ClassB extends AbstractClassB {
  constructor(a: ClassA) {
    super(a);
  }
}


