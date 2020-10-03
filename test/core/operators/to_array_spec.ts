import { expect } from 'chai';

import { createAsyncIterable, pipe, pipeAsync, toArray, toArrayAsync } from '@fiorite/core/operators';

describe('toArray() / toArrayAsync()', () => {
  describe('toArray()', () => {
    it('should convert iterable to array', () => {
      const sequence = [1, 2 ,3];

      const buffer = pipe(
        toArray(),
      )(sequence);

      expect(buffer).members(sequence);
    });
  });

  describe('toArrayAsync()', () => {
    it('should convert iterable to array', async () => {
      const sequence = [1, 2 ,3];

      const buffer = await pipeAsync(
        toArrayAsync(),
      )(createAsyncIterable(sequence));

      expect(buffer).members(sequence);
    });
  });
});
