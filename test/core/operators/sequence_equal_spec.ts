import { expect } from 'chai';

import { createAsyncIterable, pipe, pipeAsync, sequenceEqual, sequenceEqualAsync } from '@fiorite/core/operators';

describe('sequenceEqual() / sequenceEqualAsync()', () => {
  const sequence = [1, 2, 3];
  const expected = [1, 2, 3];

  describe('sequenceEqual()', () => {
    it('should compare sequences', () => {
      expect(
        pipe(
          sequenceEqual(expected),
        )(sequence),
      ).equals(true);

      expect(
        pipe(
          sequenceEqual(expected),
        )([1, 2]),
      ).equals(false);

      expect(
        pipe(
          sequenceEqual(expected),
        )([1, 2, 3, 4]),
      ).equals(false);

      expect(
        pipe(
          sequenceEqual(expected),
        )([1, 2, 2]),
      ).equals(false);
    });
  });

  describe('sequenceEqualAsync()', () => {
    it('should compare sequences', async () => {
      expect(
        await pipeAsync(
          sequenceEqualAsync(expected),
        )(createAsyncIterable(sequence)),
      ).equals(true);

      expect(
        await pipeAsync(
          sequenceEqualAsync(expected),
        )(createAsyncIterable([1, 2])),
      ).equals(false);

      expect(
        await pipeAsync(
          sequenceEqualAsync(expected),
        )(createAsyncIterable([1, 2, 3, 4])),
      ).equals(false);

      expect(
        await pipeAsync(
          sequenceEqualAsync(expected),
        )(createAsyncIterable([1, 2, 2])),
      ).equals(false);
    });
  });

});
