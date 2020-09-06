import { expect } from 'chai';

import { countBigInt, countBigIntAsync, countBigIntSync, pipe, toAsync } from '@fiorite/core/operators';

describe('countBigIntSync(), countBigIntAsync(), countBigInt()', () => {
  describe('countBigIntSync()', () => {
    it('should countBigInt without predicate', () => {
      expect(
        pipe(
          countBigIntSync(),
        )([1, 2, 3]),
      ).equals(BigInt(3));
    });

    it('should countBigInt with predicate', () => {
      expect(
        pipe(
          countBigIntSync(x => x === 2),
        )([1, 2, 3]),
      ).equals(BigInt(1));
    });
  });

  describe('countBigIntAsync()', () => {
    it('should countBigInt without predicate', async () => {
      expect(
        await pipe(
          toAsync(),
          countBigIntAsync(),
        )([1, 2, 3]),
      ).equals(BigInt(3));
    });
``
    it('should countBigInt with predicate', async () => {
      expect(
        await pipe(
          toAsync(),
          countBigIntAsync(x => x === 2),
        )([1, 2, 3]),
      ).equals(BigInt(1));
    });

    it('should countBigInt with async predicate', async () => {
      expect(
        await pipe(
          toAsync(),
          countBigIntAsync(async x => x === 2),
        )([1, 2, 3]),
      ).equals(BigInt(1));
    });
  });

  describe('countBigInt()', () => {
    it('should countBigInt without predicate', async () => {
      expect(
        pipe(
          countBigInt(),
        )([1, 2, 3]),
      ).equals(BigInt(3));

      expect(
        await pipe(
          toAsync(),
          countBigInt(),
        )([1, 2, 3]),
      ).equals(BigInt(3));
    });

    it('should countBigInt with predicate', async () => {
      expect(
        pipe(
          countBigInt(x => x === 2),
        )([1, 2, 3]),
      ).equals(BigInt(1));

      expect(
        await pipe(
          toAsync(),
          countBigInt(x => x === 2),
        )([1, 2, 3]),
      ).equals(BigInt(1));
    });

    it('should countBigInt with async predicate', async () => {
      expect(
        await pipe(
          toAsync(),
          countBigInt(async x => x === 2),
        )([1, 2, 3]),
      ).equals(BigInt(1));
    });
  });
});
