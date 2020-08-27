import { expect } from 'chai';
import { Readable } from 'stream';

import { pipe, reverse, reverseAsync, reverseSync, sequenceEqual, toArray, toAsync } from '../../src/operators';
import { AsyncCollection, collect, Collection } from '../../src';

describe('reverseSync(), reverseAsync(), Collection#reverse(), AsyncCollection#reverse(), reverse()', () => {
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
        collect([1, 2, 3])
          .toAsync()
          .reverse()
          .sequenceEqual([3, 2, 1]),
      ).equals(true);
    });
  });

  describe('reverse()', () => {
    it('should inverse a sequence', async () => {
      expect(
        await pipe(
          reverse<number>(),
          sequenceEqual([3, 2, 1]),
        )([1, 2, 3]),
      ).equals(true);

      expect(
        await pipe(
          reverse<number>(),
          sequenceEqual([3, 2, 1]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });
});
