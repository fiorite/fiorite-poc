import { expect } from 'chai';

import { cast, castAsync, castSync, pipe, sequenceEqual, toAsync } from '@fiorite/core/operators';

describe('castSync(), castAsync(), cast()', () => {
  describe('castSync()', () => {
    it('should cast a sequence', () => {
      expect(
        pipe(
          castSync<number>(),
          sequenceEqual([1, 2, 3]),
        )([1, 2, 3] as Iterable<1 | 2 | 3>)
      ).equals(true);
    });
  });

  describe('castAsync()', () => {
    it('should cast a sequence', async () => {
      expect(
        await pipe(
          toAsync(),
          castAsync<number>(),
          sequenceEqual([1, 2, 3]),
        )([1, 2, 3])
      ).equals(true);
    });
  });

  describe('cast()', () => {
    it('should cast a sequence', async () => {
      expect(
        pipe(
          cast<number>(),
          sequenceEqual([1, 2, 3]),
        )([1, 2, 3])
      ).equals(true);

      expect(
        await pipe(
          toAsync(),
          cast<number>(),
          sequenceEqual([1, 2, 3]),
        )([1, 2, 3])
      ).equals(true);
    });
  });
});
