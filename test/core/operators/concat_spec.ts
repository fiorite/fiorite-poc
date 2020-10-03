import { expect } from 'chai';

import {
  concat,
  concatAsync,
  createAsyncIterable,
  pipe,
  pipeAsync,
  sequenceEqual,
  sequenceEqualAsync
} from '@fiorite/core/operators';

describe('concat() / concatAsync()', () => {
  describe('concat()', () => {
    it('should concatenate with 2 sequences', () => {
      expect(
        pipe(
          concat([4, 5, 6], [7, 8, 9]),
          sequenceEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('concatAsync()', () => {
    it('should concatenate with 2 sequences', async () => {
      expect(
        await pipeAsync(
          concatAsync([4, 5, 6], [7, 8, 9]),
          sequenceEqualAsync([1, 2, 3, 4, 5, 6, 7, 8, 9]),
        )(createAsyncIterable([1, 2, 3])),
      ).equals(true);
    });
  });
});
