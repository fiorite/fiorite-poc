import { expect } from 'chai';

import {
  createAsyncIterable,
  pipe,
  pipeAsync,
  sequenceEqual,
  sequenceEqualAsync,
  take,
  takeAsync
} from '@fiorite/core/operators';

describe('take() / takeAsync()', () => {
  describe('take()', () => {
    it('should take 2 elements', () => {
      expect(
        pipe(
          take<number>(2),
          sequenceEqual([1, 2]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('takeAsync()', () => {
    it('should take 2 elements', async () => {
      expect(
        await pipeAsync(
          takeAsync<number>(2),
          sequenceEqualAsync([1, 2]),
        )(createAsyncIterable([1, 2, 3])),
      ).equals(true);
    });
  });
});
