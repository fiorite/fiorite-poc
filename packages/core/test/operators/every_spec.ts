import { expect } from 'chai';

import { every, everyAsync, everySync, pipe, toAsync } from '../../src/operators';
import { collect } from '../../src';

describe('everySync(), Collection#every(), everyAsync(), AsyncCollection#every(), every()', () => {
  describe('everySync()', () => {
    it('should return true on 0 elements', () => {
      expect(
        pipe(
          everySync(() => false),
        )([]),
      ).equals(true);
    });

    it('should true when predicate is positive', () => {
      expect(
        pipe(
          everySync(x => typeof x === 'number'),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should false when predicate is negative', () => {
      expect(
        pipe(
          everySync(x => x === 2),
        )([1, 2, 3]),
      ).equals(false);
    });
  });

  describe('Collection#every()', () => {
    it('should return true on 0 elements', () => {
      expect(
        collect([])
          .every(() => false),
      ).equals(true);
    });

    it('should true when predicate is positive', () => {
      expect(
        collect<unknown>([1, 2, 3])
          .every(x => typeof x === 'number'),
      ).equals(true);
    });

    it('should false when predicate is negative', () => {
      expect(
        collect<unknown>([1, 2, 3])
          .every(x => x === 2),
      ).equals(false);
    });
  });

  describe('everyAsync()', () => {
    it('should return true on 0 elements', async () => {
      expect(
        await pipe(
          toAsync(),
          everyAsync(async () => false),
        )([]),
      ).equals(true);
    });

    it('should true when predicate is positive', async () => {
      expect(
        await pipe(
          toAsync(),
          everyAsync(async x => typeof x === 'number'),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should false when predicate is negative', async () => {
      expect(
        await pipe(
          toAsync(),
          everyAsync(async x => x === 2),
        )([1, 2, 3]),
      ).equals(false);
    });
  });

  describe('AsyncCollection#every()', () => {
    it('should return true on 0 elements', async () => {
      expect(
        await collect([])
          .toAsync()
          .every(async () => false),
      ).equals(true);
    });

    it('should true when predicate is positive', async () => {
      expect(
        await collect<unknown>([1, 2, 3])
          .toAsync()
          .every(async x => typeof x === 'number'),
      ).equals(true);
    });

    it('should false when predicate is negative', async () => {
      expect(
        await collect<unknown>([1, 2, 3])
          .toAsync()
          .every(async x => x === 2),
      ).equals(false);
    });
  });

  describe('every()', () => {
    it('should return true on 0 elements', async () => {
      expect(
        pipe(
          every(() => false),
        )([]),
      ).equals(true);

      expect(
        await pipe(
          toAsync(),
          every(async () => false),
        )([]),
      ).equals(true);
    });

    it('should true when predicate is positive', async () => {
      expect(
        pipe(
          every(x => typeof x === 'number'),
        )([1, 2, 3]),
      ).equals(true);

      expect(
        await pipe(
          toAsync(),
          every(async x => typeof x === 'number'),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should false when predicate is negative', async () => {
      expect(
        pipe(
          every(x => x === 2),
        )([1, 2, 3]),
      ).equals(false);

      expect(
        await pipe(
          toAsync(),
          every(async x => x === 2),
        )([1, 2, 3]),
      ).equals(false);
    });
  });
});
