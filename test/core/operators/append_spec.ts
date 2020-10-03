import { expect } from 'chai';

import {
  append,
  appendAsync,
  createAsyncIterable,
  pipe,
  pipeAsync,
  sequenceEqual,
  sequenceEqualAsync
} from '@fiorite/core/operators';

describe('append() / appendAsync()', () => {
  describe('append()', () => {
    it('should append 3 elements', () => {
      expect(
        pipe(
          append<number>(4, 5, 6),
          sequenceEqual([1, 2, 3, 4, 5, 6]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('appendAsync()', () => {
    it('should append 3 elements', async () => {
      expect(
        await pipeAsync(
          appendAsync(4, 5, 6),
          sequenceEqualAsync([1, 2, 3, 4, 5, 6]),
        )(createAsyncIterable([1, 2, 3])),
      ).equals(true);
    });
  });
});
