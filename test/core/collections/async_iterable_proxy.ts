import { expect } from 'chai';

import { Getter, InvalidOperationError, NotImplementedError } from '../../../packages/core/functional_types';
import { AsyncIterableProxy, proxyAsyncIterable } from '../../../packages/core/collections';

describe('AsyncIterableProxy/proxyAsyncIterable()', () => {
  const iterator: AsyncIterator<never> = {
    async next(): Promise<IteratorResult<never>> {
      throw new NotImplementedError()
    }
  };

  const iterable: AsyncIterable<never> = {
    [Symbol.asyncIterator]() {
      return iterator;
    }
  };

  const getter: Getter<AsyncIterable<never>> = () => iterable;

  describe('AsyncIterableProxy', () => {
    const proxy = new AsyncIterableProxy(getter);

    describe('constructor', () => {
      it('should check getter', () => {
        expect(proxy.getter).equals(getter);
      });
    });

    describe('#[Symbol.iterator]()', () => {
      it('should return iterator', () => {
        expect(proxy[Symbol.asyncIterator]()).equals(iterator);
      });

      it('should throw error if getter return this', () => {
        let proxy: AsyncIterable<never>;

        proxy = new AsyncIterableProxy(() => proxy);

        expect(() => proxy[Symbol.asyncIterator]()).throw(InvalidOperationError);
      });
    });
  });

  describe('proxyAsyncIterable()', () => {
    const proxy = proxyAsyncIterable(getter);

    it('should test function', () => {
      expect(proxy).instanceOf(AsyncIterableProxy);
      expect(proxy.getter).equals(getter);
    });
  });
});
