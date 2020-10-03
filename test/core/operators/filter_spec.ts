import { expect } from 'chai';

import {
  createAsyncIterable,
  filter,
  filterAsync,
  pipe,
  pipeAsync,
  sequenceEqual,
  sequenceEqualAsync
} from '@fiorite/core/operators';

describe('filter() / filterAsync()', () => {
  const sequence = [1, 2, 3];
  const expected = [2];

  describe('filter()', () => {
    it('should filter', () => {
      expect(
        pipe(
          filter<number>(x => x % 2 === 0),
          sequenceEqual(expected),
        )(sequence)
      ).equals(true);
    });
  });

  describe('filterAsync()', () => {
    it('should filter', async () => {
      expect(
        await pipeAsync(
          filterAsync<number>(async x => x % 2 === 0),
          sequenceEqualAsync(expected),
        )(createAsyncIterable(sequence))
      ).equals(true);
    });
  });

});
