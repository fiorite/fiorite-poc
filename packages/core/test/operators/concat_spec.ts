import { expect } from 'chai';

import { concat, concatAsync, concatSync, pipe, sequenceEqual, toAsync } from '../../src/operators';
import { collect } from '../../src';

describe('concatSync(), Collection#concat(), concatAsync(), AsyncCollection#concat(), concat()', () => {
  describe('concatSync()', () => {
    it('should concatenate with 0 sequences', () => {
      expect(
        pipe(
          concatSync<number>(),
          sequenceEqual([1, 2, 3]),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should concatenate with 1 sequence', () => {
      expect(
        pipe(
          concatSync([4, 5, 6]),
          sequenceEqual([1, 2, 3, 4, 5, 6]),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should concatenate with 2 sequences', () => {
      expect(
        pipe(
          concatSync([4, 5, 6], [7, 8, 9]),
          sequenceEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('Collection#concat()', () => {
    it('should concatenate with 0 sequences', () => {
      expect(
        collect<number>([1, 2, 3])
          .concat()
          .sequenceEqual([1, 2, 3]),
      ).equals(true);
    });

    it('should concatenate with 1 sequence', () => {
      expect(
        collect<number>([1, 2, 3])
          .concat([4, 5, 6])
          .sequenceEqual([1, 2, 3, 4, 5, 6]),
      ).equals(true);
    });

    it('should concatenate with 2 sequences', () => {
      expect(
        collect<number>([1, 2, 3])
          .concat([4, 5, 6], [7, 8, 9])
          .sequenceEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]),
      ).equals(true);
    });
  });

  describe('concatAsync()', () => {
    it('should concatenate with 0 sequences', async () => {
      expect(
        await pipe(
          toAsync<number>(),
          concatAsync<number>(),
          sequenceEqual([1, 2, 3]),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should concatenate with 1 sequence', async () => {
      expect(
        await pipe(
          toAsync<number>(),
          concatAsync([4, 5, 6]),
          sequenceEqual([1, 2, 3, 4, 5, 6]),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should concatenate with 2 sequences', async () => {
      expect(
        await pipe(
          toAsync<number>(),
          concatAsync([4, 5, 6], [7, 8, 9]),
          sequenceEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('AsyncCollection#concat()', () => {
    it('should concatenate with 0 sequences', async () => {
      expect(
        await collect<number>([1, 2, 3])
          .toAsync()
          .concat()
          .sequenceEqual([1, 2, 3]),
      ).equals(true);
    });

    it('should concatenate with 1 sequence', async () => {
      expect(
        await collect<number>([1, 2, 3])
          .toAsync()
          .concat([4, 5, 6])
          .sequenceEqual([1, 2, 3, 4, 5, 6]),
      ).equals(true);
    });

    it('should concatenate with 2 sequences', async () => {
      expect(
        await collect<number>([1, 2, 3])
          .toAsync()
          .concat([4, 5, 6], [7, 8, 9])
          .sequenceEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]),
      ).equals(true);
    });
  });

  describe('concat()', () => {
    it('should concatenate with 0 sequences', async () => {
      expect(
        pipe(
          concat<number>(),
          sequenceEqual([1, 2, 3]),
        )([1, 2, 3]),
      ).equals(true);

      expect(
        await pipe(
          toAsync<number>(),
          concat<number>(),
          sequenceEqual([1, 2, 3]),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should concatenate with 1 sequence', async () => {
      expect(
        pipe(
          concat([4, 5, 6]),
          sequenceEqual([1, 2, 3, 4, 5, 6]),
        )([1, 2, 3]),
      ).equals(true);

      expect(
        await pipe(
          toAsync<number>(),
          concat([4, 5, 6]),
          sequenceEqual([1, 2, 3, 4, 5, 6]),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should concatenate with 2 sequences', async () => {
      expect(
        pipe(
          concat([4, 5, 6], [7, 8, 9]),
          sequenceEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]),
        )([1, 2, 3]),
      ).equals(true);

      expect(
        await pipe(
          toAsync<number>(),
          concat([4, 5, 6], [7, 8, 9]),
          sequenceEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });
});
