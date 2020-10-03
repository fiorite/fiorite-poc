import { expect } from 'chai';

import { createAsyncIterable, every, everyAsync, pipe, pipeAsync } from '@fiorite/core/operators';

describe('every() / everyAsync()', () => {
  describe('every()', () => {
    it('should return true on 0 elements', () => {
      expect(
        pipe(
          every(() => false),
        )([]),
      ).equals(true);
    });

    it('should true when predicate is positive', () => {
      expect(
        pipe(
          every(x => typeof x === 'number'),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should false when predicate is negative', () => {
      expect(
        pipe(
          every(x => x === 2),
        )([1, 2, 3]),
      ).equals(false);
    });
  });

  describe('everyAsync()', () => {
    it('should return true on 0 elements', async () => {
      expect(
        await pipeAsync(
          everyAsync(async () => false),
        )(createAsyncIterable([])),
      ).equals(true);
    });

    it('should true when predicate is positive', async () => {
      expect(
        await pipeAsync(
          everyAsync(async x => typeof x === 'number'),
        )(createAsyncIterable([1, 2, 3])),
      ).equals(true);
    });

    it('should false when predicate is negative', async () => {
      expect(
        await pipeAsync(
          everyAsync(async x => x === 2),
        )(createAsyncIterable([1, 2, 3])),
      ).equals(false);
    });
  });
});
