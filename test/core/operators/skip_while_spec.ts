import { expect } from 'chai';

import {
  createAsyncIterable,
  pipe,
  pipeAsync,
  sequenceEqual,
  sequenceEqualAsync,
  skipWhile,
  skipWhileAsync
} from '@fiorite/core/operators';

describe('skipWhile() / skipWhileAsync()', () => {
  describe('skipWhile()', () => {
    it('should skip 2 elements', () => {
      expect(
        pipe(
          skipWhile<number>(x => x < 3),
          sequenceEqual([3]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('skipWhileAsync()', () => {
    it('should skip 2 elements', async () => {
      expect(
        await pipeAsync(
          skipWhileAsync<number>(async x => x < 3),
          sequenceEqualAsync([3]),
        )(createAsyncIterable([1, 2, 3])),
      ).equals(true);
    });
  });
});
