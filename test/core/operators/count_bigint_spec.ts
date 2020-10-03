import { expect } from 'chai';

import { countBigInt, countBigIntAsync, createAsyncIterable, pipe, pipeAsync } from '@fiorite/core/operators';

describe('countBigInt() / countBigIntAsync()', () => {
  describe('countBigInt()', () => {
    it('should countBigInt without predicate', () => {
      expect(
        pipe(
          countBigInt(),
        )([1, 2, 3]),
      ).equals(BigInt(3));
    });

    it('should countBigInt with predicate', () => {
      expect(
        pipe(
          countBigInt(x => x === 2),
        )([1, 2, 3]),
      ).equals(BigInt(1));
    });
  });

  describe('countBigIntAsync()', () => {
    it('should countBigInt without predicate', async () => {
      expect(
        await pipeAsync(
          countBigIntAsync(),
        )(createAsyncIterable([1, 2, 3])),
      ).equals(BigInt(3));
    });
``
    it('should countBigInt with predicate', async () => {
      expect(
        await pipeAsync(
          countBigIntAsync(x => x === 2),
        )(createAsyncIterable([1, 2, 3])),
      ).equals(BigInt(1));
    });

    it('should countBigInt with async predicate', async () => {
      expect(
        await pipeAsync(
          countBigIntAsync(async x => x === 2),
        )(createAsyncIterable([1, 2, 3])),
      ).equals(BigInt(1));
    });
  });
});
