import { expect } from 'chai';

import {
  createAsyncIterable,
  flat,
  flatAsync,
  pipe,
  pipeAsync,
  sequenceEqual,
  sequenceEqualAsync
} from '@fiorite/core/operators';

describe('flat() / flatAsync()', () => {
  describe('flat()', () => {
    it('should return [1, 2, 3] on Array [[1], [2], 3]', () => {
      const sequence = [[1], [2], 3];
      const expected = [1, 2, 3];

      expect(
        pipe(
          flat<number>(),
          sequenceEqual(expected),
        )(sequence),
      ).equals(true);
    });
  });

  describe('flatAsync()', () => {
    it('should return [1, 2, 3] on Stream [Stream [1], [2], 3]', async () => {
      const sequence = [[1], [2], 3];
      const expected = [1, 2, 3];

      expect(
        await pipeAsync(
          flatAsync<number>(),
          sequenceEqualAsync(expected),
        )(createAsyncIterable(sequence)),
      ).equals(true);
    });
  });

});
