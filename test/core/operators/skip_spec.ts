import { expect } from 'chai';

import { pipe, sequenceEqual, skip, skipAsync, skipSync, toAsync } from '@fiorite/core/operators';

describe('skipSync(), skipAsync(), skip()', () => {
  describe('skipSync()', () => {
    it('should skip 2 elements', () => {
      expect(
        pipe(
          skipSync<number>(2),
          sequenceEqual([3]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('skipAsync()', () => {
    it('should skip 2 elements', async () => {
      expect(
        await pipe(
          toAsync<number>(),
          skipAsync<number>(2),
          sequenceEqual([3]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('skip()', () => {
    it('should skip 2 elements', async () => {
      expect(
        pipe(
          skip<number>(2),
          sequenceEqual([3]),
        )([1, 2, 3]),
      ).equals(true);

      expect(
        await pipe(
          toAsync<number>(),
          skip<number>(2),
          sequenceEqual([3]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });
});
