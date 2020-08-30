import { expect } from 'chai';

import { pipe, reverse, reverseAsync, reverseSync, sequenceEqual, toAsync } from '../../src/operators';
import { collect } from '../../src';

describe('reverseSync(), Collection#reverse(), reverseAsync(), AsyncCollection#reverse(), reverse()', () => {
  describe('reverseSync()', () => {
    it('should inverse a sequence', () => {
      expect(
        pipe(
          reverseSync<number>(),
          sequenceEqual([3, 2, 1]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('Collection#reverse()', () => {
    it('should inverse a sequence', () => {
      expect(
        collect([1, 2, 3])
          .reverse()
          .sequenceEqual([3, 2, 1]),
      ).equals(true);
    });
  });

  describe('reverseAsync()', () => {
    it('should inverse a sequence', async () => {
      expect(
        await pipe(
          toAsync<number>(),
          reverseAsync<number>(),
          sequenceEqual([3, 2, 1]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('AsyncCollection#reverse()', () => {
    it('should inverse a sequence', async () => {
      expect(
        await collect([1, 2, 3])
          .toAsync()
          .reverse()
          .sequenceEqual([3, 2, 1]),
      ).equals(true);
    });
  });

  describe('reverse()', () => {
    it('should inverse a sequence', async () => {
      expect(
        pipe(
          reverse<number>(),
          sequenceEqual([3, 2, 1]),
        )([1, 2, 3]),
      ).equals(true);

      expect(
        await pipe(
          toAsync<number>(),
          reverse<number>(),
          sequenceEqual([3, 2, 1]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });
});
