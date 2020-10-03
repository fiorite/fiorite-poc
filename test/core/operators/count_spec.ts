import { expect } from 'chai';

import { count, countAsync, createAsyncIterable, pipe, pipeAsync } from '@fiorite/core/operators';

describe('count() / countAsync()', () => {
  describe('count()', () => {
    it('should count without predicate', () => {
      expect(
        pipe(
          count(),
        )([1, 2, 3]),
      ).equals(3);
    });

    it('should count with predicate', () => {
      expect(
        pipe(
          count(x => x === 2),
        )([1, 2, 3]),
      ).equals(1);
    });
  });

  describe('countAsync()', () => {
    it('should count without predicate', async () => {
      expect(
        await pipeAsync(
          countAsync(),
        )(createAsyncIterable([1, 2, 3])),
      ).equals(3);
    });

    it('should count with predicate', async () => {
      expect(
        await pipeAsync(
          countAsync(x => x === 2),
        )(createAsyncIterable([1, 2, 3])),
      ).equals(1);
    });

    it('should count with async predicate', async () => {
      expect(
        await pipeAsync(
          countAsync(async x => x === 2),
        )(createAsyncIterable([1, 2, 3])),
      ).equals(1);
    });
  });
});
