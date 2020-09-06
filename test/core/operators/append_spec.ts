import { expect } from 'chai';

import { append, appendAsync, appendSync, pipe, sequenceEqual, toAsync } from '@fiorite/core/operators';

describe('appendSync(), appendAsync(), append()', () => {
  describe('appendSync()', () => {
    it('should append 3 elements', () => {
      expect(
        pipe(
          appendSync<number>(4, 5, 6),
          sequenceEqual([1, 2, 3, 4, 5, 6]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('appendAsync()', () => {
    it('should append 3 elements', async () => {
      expect(
        await pipe(
          toAsync<number>(),
          appendAsync(4, 5, 6),
          sequenceEqual([1, 2, 3, 4, 5, 6]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('append()', () => {
    it('should append 3 elements', async () => {
      expect(
        pipe(
          append(4, 5, 6),
          sequenceEqual([1, 2, 3, 4, 5, 6]),
        )([1, 2, 3]),
      ).equals(true);

      expect(
        await pipe(
          toAsync<number>(),
          append(4, 5, 6),
          sequenceEqual([1, 2, 3, 4, 5, 6]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });
});
