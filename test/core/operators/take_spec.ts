import { expect } from 'chai';

import { pipe, sequenceEqual, take, takeAsync, takeSync, toAsync } from '../../../packages/core/operators';
import { collect } from '../../../packages/core/collections';

describe('takeSync(), Collection#take(), takeAsync(), AsyncCollection#take(), take()', () => {
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

  describe('Collection#take()', () => {
    it('should take 2 elements', () => {
      expect(
        collect([1, 2, 3])
          .take(2)
          .sequenceEqual([1, 2]),
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

  describe('AsyncCollection#take()', () => {
    it('should take 2 elements', async () => {
      expect(
        await collect([1, 2, 3])
          .toAsync()
          .take(2)
          .sequenceEqual([1, 2]),
      ).equals(true);
    });
  });

  describe('take()', () => {
    it('should inverse a sequence', async () => {
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
