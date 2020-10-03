import { expect } from 'chai';

import {
  createAsyncIterable,
  pipe,
  pipeAsync,
  reverse,
  reverseAsync,
  sequenceEqual,
  sequenceEqualAsync
} from '@fiorite/core/operators';

describe('reverse() / reverseAsync()', () => {
  describe('reverse()', () => {
    it('should inverse a sequence', () => {
      expect(
        pipe(
          reverse<number>(),
          sequenceEqual([3, 2, 1]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('reverseAsync()', () => {
    it('should inverse a sequence', async () => {
      expect(
        await pipeAsync(
          reverseAsync<number>(),
          sequenceEqualAsync([3, 2, 1]),
        )(createAsyncIterable([1, 2, 3])),
      ).equals(true);
    });
  });
});
