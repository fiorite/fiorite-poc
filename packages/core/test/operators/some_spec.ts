import { expect } from 'chai';
import { Readable } from 'stream';

import { some, someAsync, someSync } from '../../src/operators';
import { collect } from '../../src';

describe('someSync(), someAsync(), Collection#some(), AsyncCollection#some(), some()', () => {
  describe('someSync()', () => {
    // TODO: Check index.

    it('should return false on 0 elements', () => {
      expect(
        someSync<number>()([])
      ).equals(false);
    });

    it('should return true on 3 elements', () => {
      expect(
        someSync<number>()([1, 2, 3])
      ).equals(true);
    });

    it('should test index', () => {
      let called = false;

      someSync<number>((x, index) => {
        called = true;

        expect(x).equals(1);
        expect(index).equals(0);

        return true;
      })([1]);

      expect(called).equals(true);
    });

    it('should false when predicate is negative', () => {
      expect(
        someSync<number>(x => x === 2)([1, 3])
      ).equals(false);
    });

    it('should false when predicate is positive', () => {
      expect(
        someSync<number>(x => x === 2)([1, 2, 3])
      ).equals(true);
    });
  });

  describe('Collection#some()', () => {
    it('should return false on 0 elements', () => {
      expect(
        collect([]).some(),
      ).equals(false);
    });

    it('should return true on 3 elements', () => {
      expect(
        collect([1, 2, 3]).some(),
      ).equals(true);
    });

    it('should false when predicate is negative', () => {
      expect(
        collect([1, 3]).some(x => x === 2),
      ).equals(false);
    });

    it('should false when predicate is positive', () => {
      expect(
        collect([1, 2, 3]).some(x => x === 2),
      ).equals(true);
    });
  });

  describe('someAsync()', () => {
    function createSequence<E>(elements: E[]): AsyncIterable<E> {
      return Readable.from(elements);
    }

    it('should return false on 0 elements', async () => {
      expect(
        await someAsync<number>()(createSequence([]))
      ).equals(false);
    });

    it('should return true on 3 elements', async () => {
      expect(
        await someAsync<number>()(createSequence([1, 2, 3]))
      ).equals(true);
    });

    it('should test index', async () => {
      let called = false;

      await someAsync<number>(async (x, index) => {
        called = true;

        expect(x).equals(1);
        expect(index).equals(0);

        return true;
      })(createSequence([1]));

      expect(called).equals(true);
    });

    it('should false when predicate is negative', async () => {
      expect(
        await someAsync<number>(x => Promise.resolve(x === 2))(createSequence([1, 3]))
      ).equals(false);
    });

    it('should false when predicate is positive', async () => {
      expect(
        await someAsync<number>(x => Promise.resolve(x === 2))(createSequence([1, 2, 3]))
      ).equals(true);
    });
  });

  describe('AsyncCollection#some()', () => {
    function createSequence<E>(elements: E[]): AsyncIterable<E> {
      return Readable.from(elements);
    }

    it('should return false on 0 elements', async () => {
      expect(
        await collect(createSequence([])).some(),
      ).equals(false);
    });

    it('should return true on 3 elements', async () => {
      expect(
        await collect(createSequence([1, 2, 3])).some(),
      ).equals(true);
    });

    it('should false when predicate is negative', async () => {
      expect(
        await collect(createSequence([1, 3])).some(x => Promise.resolve(x === 2)),
      ).equals(false);
    });

    it('should false when predicate is positive', async () => {
      expect(
        await collect(createSequence([1, 2, 3])).some(x => Promise.resolve(x === 2)),
      ).equals(true);
    });
  });

  describe('some()', () => {
    function createAsyncSequence<E>(elements: E[]): AsyncIterable<E> {
      return Readable.from(elements);
    }

    it('should return false on 0 elements', async () => {
      const operator = some<number>();

      expect(
        operator([]),
      ).equals(false);

      expect(
        await operator(createAsyncSequence([]))
      ).equals(false);
    });

    it('should return true on 3 elements', async () => {
      const operator = some<number>();

      expect(
        operator([1, 2, 3]),
      ).equals(true);

      expect(
        await operator(createAsyncSequence([1, 2, 3]))
      ).equals(true);
    });

    it('should false when predicate is negative', async () => {
      const operator = some<number>(x => x === 2);

      expect(
        await operator([1, 3]),
      ).equals(false);

      expect(
        await operator(createAsyncSequence([1, 3]))
      ).equals(false);
    });

    it('should false when predicate is positive', async () => {
      const operator = some<number>(x => x === 2);

      expect(
        await operator([1, 2, 3]),
      ).equals(true);

      expect(
        await operator(createAsyncSequence([1, 2, 3]))
      ).equals(true);
    });
  });
});
