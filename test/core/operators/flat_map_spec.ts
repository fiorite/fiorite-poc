import { expect } from 'chai';

import {
  createAsyncIterable,
  flatMap,
  flatMapAsync,
  pipe,
  pipeAsync,
  sequenceEqual,
  sequenceEqualAsync
} from '@fiorite/core/operators';

describe('flatMap() / flatMapAsync()', () => {
  interface Structure {
    value: number | number[]
  }

  const sequence = [{ value: [1] }, { value: [2] }, { value: [3] }];
  const expected = [1, 2, 3];

  describe('flatMap()', () => {
    it('should flat', () => {
      expect(
        pipe(
          flatMap<Structure, number>(x => x.value),
          sequenceEqual(expected),
        )(sequence),
      ).equals(true);
    });
  });

  describe('flatMapAsync()', () => {
    it('should flat', async () => {
      expect(
        await pipeAsync(
          flatMapAsync<Structure, number>(async x => x.value),
          sequenceEqualAsync(expected),
        )(createAsyncIterable(sequence)),
      ).equals(true);
    });
  });
});
