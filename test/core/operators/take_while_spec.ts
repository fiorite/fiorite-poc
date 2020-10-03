import { expect } from 'chai';

import {
  createAsyncIterable,
  pipe,
  pipeAsync,
  sequenceEqual,
  sequenceEqualAsync,
  takeWhile,
  takeWhileAsync
} from '@fiorite/core/operators';

describe('takeWhile() / takeWhileAsync()', () => {
  describe('takeWhile()', () => {
    it('should takeWhile 2 elements', () => {
      expect(
        pipe(
          takeWhile<number>(x => x < 3),
          sequenceEqual([1, 2]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('takeWhileAsync()', () => {
    it('should takeWhile 2 elements', async () => {
      expect(
        await pipeAsync(
          takeWhileAsync<number>(async x => x < 3),
          sequenceEqualAsync([1, 2]),
        )(createAsyncIterable([1, 2, 3])),
      ).equals(true);
    });
  });
});
