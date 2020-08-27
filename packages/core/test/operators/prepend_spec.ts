import { expect } from 'chai';

import { prepend, prependAsync, prependSync, pipe, sequenceEqual, toAsync } from '../../src/operators';
import { collect } from '../../src';

describe('prependSync(), prependAsync(), Collection#prepend(), AsyncCollection#prepend(), prepend()', () => {
  describe('prependSync()', () => {
    it('should prepend 0 elements', () => {
      expect(
        pipe(
          prependSync<number>(),
          sequenceEqual([1, 2, 3]),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should prepend 1 element', () => {
      expect(
        pipe(
          prependSync<number>(4),
          sequenceEqual([4, 1, 2, 3]),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should prepend 3 elements', () => {
      expect(
        pipe(
          prependSync<number>(4, 5, 6),
          sequenceEqual([4, 5, 6, 1, 2, 3]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('Collection#prepend()', () => {
    it('should prepend 0 elements', () => {
      expect(
        collect([1, 2, 3])
          .prepend()
          .sequenceEqual([1, 2, 3]),
      ).equals(true);
    });

    it('should prepend 1 element', () => {
      expect(
        collect([1, 2, 3])
          .prepend(4)
          .sequenceEqual([4, 1, 2, 3]),
      ).equals(true);
    });

    it('should prepend 3 elements', () => {
      expect(
        collect([1, 2, 3])
          .prepend(4, 5, 6)
          .sequenceEqual([4, 5, 6, 1, 2, 3]),
      ).equals(true);
    });
  });

  describe('prependAsync()', () => {
    it('should prepend 0 elements', async () => {
      expect(
        await pipe(
          toAsync<number>(),
          prependAsync(),
          sequenceEqual([1, 2, 3]),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should prepend 1 element', async () => {
      expect(
        await pipe(
          toAsync<number>(),
          prependAsync(4),
          sequenceEqual([4, 1, 2, 3]),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should prepend 3 elements', async () => {
      expect(
        await pipe(
          toAsync<number>(),
          prependAsync(4, 5, 6),
          sequenceEqual([4, 5, 6, 1, 2, 3]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('AsyncCollection#prepend()', () => {
    it('should prepend 0 elements', async () => {
      expect(
        await collect([1, 2, 3])
          .toAsync()
          .prepend()
          .sequenceEqual([1, 2, 3]),
      ).equals(true);
    });

    it('should prepend 1 element', async () => {
      expect(
        await collect([1, 2, 3])
          .toAsync()
          .prepend(4)
          .sequenceEqual([4, 1, 2, 3]),
      ).equals(true);
    });

    it('should prepend 3 elements', async () => {
      expect(
        await collect([1, 2, 3])
          .toAsync()
          .prepend(4)
          .sequenceEqual([4, 1, 2, 3]),
      ).equals(true);
    });
  });

  describe('prepend()', () => {
    it('should prepend 0 elements', async () => {
      expect(
        pipe(
          prepend<number>(),
          sequenceEqual([1, 2, 3]),
        )([1, 2, 3]),
      ).equals(true);

      expect(
        await pipe(
          toAsync<number>(),
          prepend<number>(),
          sequenceEqual([1, 2, 3]),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should prepend 1 element', async () => {
      expect(
        pipe(
          prepend(4),
          sequenceEqual([4, 1, 2, 3]),
        )([1, 2, 3]),
      ).equals(true);

      expect(
        await pipe(
          toAsync<number>(),
          prepend(4),
          sequenceEqual([4, 1, 2, 3]),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should prepend 3 elements', async () => {
      expect(
        pipe(
          prepend(4, 5, 6),
          sequenceEqual([4, 5, 6, 1, 2, 3]),
        )([1, 2, 3]),
      ).equals(true);

      expect(
        await pipe(
          toAsync<number>(),
          prepend(4, 5, 6),
          sequenceEqual([4, 5, 6, 1, 2, 3]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });
});
