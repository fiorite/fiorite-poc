import { expect } from 'chai';

import { createAsyncIterable, includes, includesAsync, pipe, pipeAsync } from '@fiorite/core/operators';

describe('includes() / includesAsync()', () => {
  const sequence = [1, 2, 3];

  describe('includes()', () => {
    it('should return true if element is in a sequence', () => {
      expect(
        pipe(
          includes(2)
        )(sequence),
      ).equals(true);
    });

    it('should return false if element is not in a sequence', () => {
      expect(
        pipe(
          includes(0)
        )(sequence),
      ).equals(false);
    });

    it('should return true if element is not in a sequence and comparer ignores it', () => {
      expect(
        pipe(
          includes(0, () => true)
        )(sequence),
      ).equals(true);
    });
  });

  describe('includesAsync()', () => {
    it('should return true if element is in a sequence', async () => {
      expect(
        await pipeAsync(
          includesAsync(2)
        )(createAsyncIterable(sequence)),
      ).equals(true);
    });

    it('should return false if element is not in a sequence', async () => {
      expect(
        await pipeAsync(
          includesAsync(0)
        )(createAsyncIterable(sequence)),
      ).equals(false);
    });

    it('should return true if element is not in a sequence and comparer ignores it', async () => {
      expect(
        await pipeAsync(
          includesAsync(0, () => true)
        )(createAsyncIterable(sequence)),
      ).equals(true);
    });
  });
});
