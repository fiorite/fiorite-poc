import { expect } from 'chai';

import {
  createAsyncIterable,
  pipe,
  pipeAsync,
  sequenceEqual,
  sequenceEqualAsync,
  skip,
  skipAsync
} from '@fiorite/core/operators';

describe('skip() / skipAsync()', () => {
  describe('skip()', () => {
    it('should skip 2 elements', () => {
      expect(
        pipe(
          skip<number>(2),
          sequenceEqual([3]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('skipAsync()', () => {
    it('should skip 2 elements', async () => {
      expect(
        await pipeAsync(
          skipAsync<number>(2),
          sequenceEqualAsync([3]),
        )(createAsyncIterable([1, 2, 3])),
      ).equals(true);
    });
  });
});
