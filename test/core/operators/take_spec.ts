import { expect } from 'chai';

import { pipe, sequenceEqual, take, takeAsync, takeSync, toAsync } from '@fiorite/core/operators';

describe('takeSync(), takeAsync(), take()', () => {
  describe('takeSync()', () => {
    it('should take 2 elements', () => {
      expect(
        pipe(
          takeSync<number>(2),
          sequenceEqual([1, 2]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('takeAsync()', () => {
    it('should take 2 elements', async () => {
      expect(
        await pipe(
          toAsync<number>(),
          takeAsync<number>(2),
          sequenceEqual([1, 2]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('take()', () => {
    it('should take 2 elements', async () => {
      expect(
        pipe(
          take<number>(2),
          sequenceEqual([1, 2]),
        )([1, 2, 3]),
      ).equals(true);

      expect(
        await pipe(
          toAsync<number>(),
          take<number>(2),
          sequenceEqual([1, 2]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });
});
