import { expect } from 'chai';

import { createAsyncIterable, pipe, pipeAsync, some, someAsync } from '@fiorite/core/operators';

describe('some() / someAsync()', () => {
  describe('some()', () => {
    it('should return false on 0 elements', () => {
      expect(
        pipe(
          some<number>(),
        )([]),
      ).equals(false);
    });

    it('should return true on 3 elements', () => {
      expect(
        pipe(
          some<number>(),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should false when predicate is negative', () => {
      expect(
        pipe(
          some<number>(x => x === 2),
        )([1, 3]),
      ).equals(false);
    });

    it('should false when predicate is positive', () => {
      expect(
        pipe(
          some<number>(x => x === 2),
        )([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('someAsync()', () => {
    it('should return false on 0 elements', async () => {
      expect(
        await pipeAsync(
          someAsync<number>(),
        )(createAsyncIterable([])),
      ).equals(false);
    });

    it('should return true on 3 elements', async () => {
      expect(
        await pipeAsync(
          someAsync<number>(),
        )(createAsyncIterable([1, 2, 3])),
      ).equals(true);
    });

    it('should false when predicate is negative', async () => {
      expect(
        await pipeAsync(
          someAsync<number>(x => x === 2),
        )(createAsyncIterable([1, 3])),
      ).equals(false);
    });

    it('should false when predicate is positive', async () => {
      expect(
        await pipeAsync(
          someAsync<number>(x => x === 2),
        )(createAsyncIterable([1, 2, 3])),
      ).equals(true);
    });
  });
});
