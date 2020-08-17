import { DefaultInjector, Injector } from '../../src/di/injector';
import { Injection } from '../../src/di';
import { expect } from 'chai';

describe('DefaultInjector', () => {
  describe('self Injector provider', () => {

  });

  describe('#has()', () => {
    it('should ', () => {
      const provider = new Injection(ClassA, ClassA);
      const injector = new DefaultInjector([provider]);
    });
  });

  describe('#[Symbol.iterator]()', () => {
    it('should check result', () => {
      const injector = new DefaultInjector([]);

      const iterator = injector[Symbol.iterator]();
      expect(iterator.next().value).equals(Injector);
      expect(iterator.next().done).equals(true);
    });
  });
});

class ClassA { }
class ClassB { }
class ClassC { }
