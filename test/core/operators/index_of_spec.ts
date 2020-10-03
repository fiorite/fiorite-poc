import { expect } from 'chai';

import { createAsyncIterable, indexOf, indexOfAsync, pipe, pipeAsync } from '@fiorite/core/operators';

describe('indexOf() / indexOfAsync()', () => {
  const sequence = [1];

  describe('indexOf()', () => {
    it('should return true if element is in a sequence', () => {
      expect(
        pipe(
          indexOf(1)
        )(sequence),
      ).equals(0);
    });

    it('should return false if element is not in a sequence', () => {
      expect(
        pipe(
          indexOf(0)
        )(sequence),
      ).equals(-1);
    });

    it('should return true if element is not in a sequence and comparer ignores it', () => {
      expect(
        pipe(
          indexOf(0, () => true)
        )(sequence),
      ).equals(0);
    });
  });

  describe('indexOfAsync()', () => {
    it('should return true if element is in a sequence', async () => {
      expect(
        await pipeAsync(
          indexOfAsync(1)
        )(createAsyncIterable(sequence)),
      ).equals(0);
    });

    it('should return false if element is not in a sequence', async () => {
      expect(
        await pipeAsync(
          indexOfAsync(0)
        )(createAsyncIterable(sequence)),
      ).equals(-1);
    });

    it('should return true if element is not in a sequence and comparer ignores it', async () => {
      expect(
        await pipeAsync(
          indexOfAsync(0, () => true)
        )(createAsyncIterable(sequence)),
      ).equals(0);
    });
  });
});
