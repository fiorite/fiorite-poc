import { expect } from 'chai';

import {
  createAsyncIterable,
  map,
  mapAsync,
  pipe,
  pipeAsync,
  sequenceEqual,
  sequenceEqualAsync
} from '@fiorite/core/operators';

describe('map() / mapAsync()', () => {
  const sequence = [1, 2, 3];
  const expected = [2, 3, 4];

  describe('map()', () => {
    it('should map', () => {
      expect(
        pipe(
          map<number>(x => x + 1),
          sequenceEqual(expected),
        )(sequence),
      ).equals(true);
    });
  });

  describe('mapAsync()', () => {
    it('should map', async () => {
      expect(
        await pipeAsync(
          mapAsync<number>(x => x + 1),
          sequenceEqualAsync(expected),
        )(createAsyncIterable(sequence)),
      ).equals(true);
    });
  });

});
