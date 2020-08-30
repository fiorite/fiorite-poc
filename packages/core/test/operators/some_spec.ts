import { expect } from 'chai';

import { pipe, some, someAsync, someSync, toAsync } from '../../src/operators';
import { collect } from '../../src';

describe('someSync(), Collection#some(), someAsync(), AsyncCollection#some(), some()', () => {
  describe('someSync()', () => {
    it('should return false on 0 elements', () => {
      expect(
        pipe(
          someSync<number>(),
        )([]),
      ).equals(false);
    });

    it('should return true on 3 elements', () => {
      expect(
        pipe(
          someSync<number>(),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should false when predicate is negative', () => {
      expect(
        pipe(
          someSync<number>(x => x === 2),
        )([1, 3]),
      ).equals(false);
    });

    it('should false when predicate is positive', () => {
      expect(
        pipe(
          someSync<number>(x => x === 2),
        )([1, 2, 3]),
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
    it('should return false on 0 elements', async () => {
      expect(
        await pipe(
          toAsync<number>(),
          someAsync<number>(),
        )([]),
      ).equals(false);
    });

    it('should return true on 3 elements', async () => {
      expect(
        await pipe(
          toAsync<number>(),
          someAsync<number>(),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should false when predicate is negative', async () => {
      expect(
        await pipe(
          toAsync<number>(),
          someAsync<number>(x => x === 2),
        )([1, 3]),
      ).equals(false);
    });

    it('should false when predicate is positive', async () => {
      expect(
        await pipe(
          toAsync<number>(),
          someAsync<number>(x => x === 2),
        )([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('AsyncCollection#some()', () => {
    it('should return false on 0 elements', async () => {
      expect(
        await collect([])
          .toAsync()
          .some(),
      ).equals(false);
    });

    it('should return true on 3 elements', async () => {
      expect(
        await collect([1, 2, 3])
          .toAsync()
          .some(),
      ).equals(true);
    });

    it('should false when predicate is negative', async () => {
      expect(
        await collect([1, 3])
          .toAsync()
          .some(x => Promise.resolve(x === 2)),
      ).equals(false);
    });

    it('should false when predicate is positive', async () => {
      expect(
        await collect([1, 2, 3])
          .toAsync()
          .some(x => Promise.resolve(x === 2)),
      ).equals(true);
    });
  });

  describe('some()', () => {
    it('should return false on 0 elements', async () => {
      expect(
        pipe(
          some<number>(),
        )([]),
      ).equals(false);

      expect(
        await pipe(
          toAsync<number>(),
          some<number>(),
        )([]),
      ).equals(false);
    });

    it('should return true on 3 elements', async () => {
      expect(
        pipe(
          some<number>(),
        )([1, 2, 3]),
      ).equals(true);

      expect(
        await pipe(
          toAsync<number>(),
          some<number>(),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should false when predicate is negative', async () => {
      expect(
        pipe(
          some<number>(x => x === 2),
        )([1, 3]),
      ).equals(false);

      expect(
        await pipe(
          toAsync<number>(),
          some<number>(async x => x === 2),
        )([1, 3]),
      ).equals(false);
    });

    it('should false when predicate is positive', async () => {
      expect(
        pipe(
          some<number>(x => x === 2),
        )([1, 2, 3]),
      ).equals(true);

      expect(
        await pipe(
          toAsync<number>(),
          some<number>(async x => x === 2),
        )([1, 2, 3]),
      ).equals(true);
    });
  });
});
