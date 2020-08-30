import { expect } from 'chai';

import { pipe, sequenceEqual, skip, skipAsync, skipSync, toAsync } from '../../src/operators';
import { collect } from '../../src';

describe('skipSync(), Collection#skip(), skipAsync(), AsyncCollection#skip(), skip()', () => {
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

  describe('Collection#skip()', () => {
    it('should skip 2 elements', () => {
      expect(
        collect([1, 2, 3])
          .skip(2)
          .sequenceEqual([3]),
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

  describe('AsyncCollection#skip()', () => {
    it('should skip 2 elements', async () => {
      expect(
        await collect([1, 2, 3])
          .toAsync()
          .skip(2)
          .sequenceEqual([3]),
      ).equals(true);
    });
  });

  describe('skip()', () => {
    it('should inverse a sequence', async () => {
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
