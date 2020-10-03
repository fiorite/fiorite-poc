import { expect } from 'chai';

import {
  createAsyncIterable,
  pipe,
  pipeAsync,
  prepend,
  prependAsync,
  sequenceEqual,
  sequenceEqualAsync
} from '@fiorite/core/operators';

describe('prepend() / prependAsync()', () => {
  describe('prependSync()', () => {
    it('should prepend 0 elements', () => {
      expect(
        pipe(
          prepend<number>(),
          sequenceEqual([1, 2, 3]),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should prepend 1 element', () => {
      expect(
        pipe(
          prepend<number>(4),
          sequenceEqual([4, 1, 2, 3]),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should prepend 3 elements', () => {
      expect(
        pipe(
          prepend<number>(4, 5, 6),
          sequenceEqual([4, 5, 6, 1, 2, 3]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('prependAsync()', () => {
    it('should prepend 0 elements', async () => {
      expect(
        await pipeAsync(
          prependAsync<number>(),
          sequenceEqualAsync([1, 2, 3]),
        )(createAsyncIterable([1, 2, 3])),
      ).equals(true);
    });

    it('should prepend 1 element', async () => {
      expect(
        await pipeAsync(
          prependAsync(4),
          sequenceEqualAsync([4, 1, 2, 3]),
        )(createAsyncIterable([1, 2, 3])),
      ).equals(true);
    });

    it('should prepend 3 elements', async () => {
      expect(
        await pipeAsync(
          prependAsync(4, 5, 6),
          sequenceEqualAsync([4, 5, 6, 1, 2, 3]),
        )(createAsyncIterable([1, 2, 3])),
      ).equals(true);
    });
  });
});
