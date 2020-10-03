import { expect } from 'chai';

import { Getter, InvalidOperationError, NotImplementedError } from '../../../packages/core/functional_types';
import { IterableProxy, proxyIterable } from '../../../packages/core/collections';

describe('IterableProxy/proxyIterable()', () => {
  const iterator: Iterator<never> = {
    next(): IteratorResult<never> {
      throw new NotImplementedError()
    }
  };

  const iterable: Iterable<never> = {
    [Symbol.iterator]() {
      return iterator;
    }
  };

  const getter: Getter<Iterable<never>> = () => iterable;

  describe('IterableProxy', () => {
    const proxy = new IterableProxy(getter);

    describe('constructor', () => {
      it('should check getter', () => {
        expect(proxy.getter).equals(getter);
      });
    });

    describe('#[Symbol.iterator]()', () => {
      it('should return iterator', () => {
        expect(proxy[Symbol.iterator]()).equals(iterator);
      });

      it('should throw error if getter return this', () => {
        let proxy: Iterable<never>;

        proxy = new IterableProxy(() => proxy);

        expect(() => proxy[Symbol.iterator]()).throw(InvalidOperationError);
      });
    });
  });

  describe('proxyIterable()', () => {
    const proxy = proxyIterable(getter);

    it('should test function', () => {
      expect(proxy).instanceOf(IterableProxy);
      expect(proxy.getter).equals(getter);
    });
  });
});
