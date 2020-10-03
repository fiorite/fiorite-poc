import { expect } from 'chai';

import { createAsyncIterable, lastIndexOf, lastIndexOfAsync, pipe, pipeAsync } from '@fiorite/core/operators';

describe('lastIndexOf() / lastIndexOfAsync()', () => {
  const sequence = [1, 1];

  describe('lastIndexOf()', () => {
    it('should return true if element is in a sequence', () => {
      expect(
        pipe(
          lastIndexOf(1)
        )(sequence),
      ).equals(1);
    });

    it('should return false if element is not in a sequence', () => {
      expect(
        pipe(
          lastIndexOf(0)
        )(sequence),
      ).equals(-1);
    });

    it('should return true if element is not in a sequence and comparer ignores it', () => {
      expect(
        pipe(
          lastIndexOf(0, () => true)
        )(sequence),
      ).equals(1);
    });
  });

  describe('lastIndexOfAsync()', () => {
    it('should return true if element is in a sequence', async () => {
      expect(
        await pipeAsync(
          lastIndexOfAsync(1)
        )(createAsyncIterable(sequence)),
      ).equals(1);
    });

    it('should return false if element is not in a sequence', async () => {
      expect(
        await pipeAsync(
          lastIndexOfAsync(0)
        )(createAsyncIterable(sequence)),
      ).equals(-1);
    });

    it('should return true if element is not in a sequence and comparer ignores it', async () => {
      expect(
        await pipeAsync(
          lastIndexOfAsync(0, () => true)
        )(createAsyncIterable(sequence)),
      ).equals(1);
    });
  });
});
