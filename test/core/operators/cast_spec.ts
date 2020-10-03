import { expect } from 'chai';

import {
  cast,
  castAsync,
  createAsyncIterable,
  pipe,
  pipeAsync,
  sequenceEqual,
  sequenceEqualAsync
} from '@fiorite/core/operators';

describe('cast() / castAsync()', () => {
  describe('cast()', () => {
    it('should cast a sequence', () => {
      expect(
        pipe(
          cast<number>(),
          sequenceEqual([1, 2, 3]),
        )([1, 2, 3] as Iterable<1 | 2 | 3>)
      ).equals(true);
    });
  });

  describe('castAsync()', () => {
    it('should cast a sequence', async () => {
      expect(
        await pipeAsync(
          castAsync<number>(),
          sequenceEqualAsync([1, 2, 3]),
        )(createAsyncIterable([1, 2, 3]))
      ).equals(true);
    });
  });
});
