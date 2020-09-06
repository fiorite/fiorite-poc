import { expect } from 'chai';

import { count, countAsync, countSync, pipe, toAsync } from '@fiorite/core/operators';

describe('countSync(), countAsync(), count()', () => {
  describe('countSync()', () => {
    it('should count without predicate', () => {
      expect(
        pipe(
          countSync(),
        )([1, 2, 3]),
      ).equals(3);
    });

    it('should count with predicate', () => {
      expect(
        pipe(
          countSync(x => x === 2),
        )([1, 2, 3]),
      ).equals(1);
    });
  });

  describe('countAsync()', () => {
    it('should count without predicate', async () => {
      expect(
        await pipe(
          toAsync(),
          countAsync(),
        )([1, 2, 3]),
      ).equals(3);
    });

    it('should count with predicate', async () => {
      expect(
        await pipe(
          toAsync(),
          countAsync(x => x === 2),
        )([1, 2, 3]),
      ).equals(1);
    });

    it('should count with async predicate', async () => {
      expect(
        await pipe(
          toAsync(),
          countAsync(async x => x === 2),
        )([1, 2, 3]),
      ).equals(1);
    });
  });

  describe('count()', () => {
    it('should count without predicate', async () => {
      expect(
        pipe(
          count(),
        )([1, 2, 3]),
      ).equals(3);

      expect(
        await pipe(
          toAsync(),
          count(),
        )([1, 2, 3]),
      ).equals(3);
    });

    it('should count with predicate', async () => {
      expect(
        pipe(
          count(x => x === 2),
        )([1, 2, 3]),
      ).equals(1);

      expect(
        await pipe(
          toAsync(),
          count(x => x === 2),
        )([1, 2, 3]),
      ).equals(1);
    });

    it('should count with async predicate', async () => {
      expect(
        await pipe(
          toAsync(),
          count(async x => x === 2),
        )([1, 2, 3]),
      ).equals(1);
    });
  });
});
