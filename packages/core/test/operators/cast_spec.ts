import { expect } from 'chai';

import { cast, castAsync, castSync, pipe, sequenceEqual, toAsync } from '../../src/operators';
import { collect } from '../../src';

describe('castSync(), Collection#cast(), castAsync(), AsyncCollection#cast(), cast()', () => {
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

  describe('Collection#cast()', () => {
    it('should cast a sequence', () => {
      expect(
        collect<1 | 2 | 3>([1, 2, 3])
          .cast<number>()
          .sequenceEqual([1, 2, 3])
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

  describe('AsyncCollection#cast()', () => {
    it('should cast a sequence', async () => {
      expect(
        await collect<1 | 2 | 3>([1, 2, 3])
          .toAsync()
          .cast<number>()
          .sequenceEqual([1, 2, 3])
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
