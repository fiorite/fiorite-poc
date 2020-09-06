import { expect } from 'chai';

import { concat, concatAsync, concatSync, pipe, sequenceEqual, toAsync } from '@fiorite/core/operators';

describe('concatSync(), concatAsync(), concat()', () => {
  describe('concatSync()', () => {
    it('should concatenate with 2 sequences', () => {
      expect(
        pipe(
          concatSync([4, 5, 6], [7, 8, 9]),
          sequenceEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('concatAsync()', () => {
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

  describe('concat()', () => {
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
          concat([4, 5, 6], toAsync<number>()([7, 8, 9])),
          sequenceEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });
});
