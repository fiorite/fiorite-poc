import { expect } from 'chai';

import { append, appendAsync, appendSync, pipe, sequenceEqual, toAsync } from '../../../packages/core/operators';
import { collect } from '../../../packages/core/collections';

describe('appendSync(), Collection#append(), appendAsync(), AsyncCollection#append(), append()', () => {
  describe('appendSync()', () => {
    it('should append 0 elements', () => {
      expect(
        pipe(
          appendSync<number>(),
          sequenceEqual([1, 2, 3]),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should append 1 element', () => {
      expect(
        pipe(
          appendSync<number>(4),
          sequenceEqual([1, 2, 3, 4]),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should append 3 elements', () => {
      expect(
        pipe(
          appendSync<number>(4, 5, 6),
          sequenceEqual([1, 2, 3, 4, 5, 6]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('Collection#append()', () => {
    it('should append 0 elements', () => {
      expect(
        collect([1, 2, 3])
          .append()
          .sequenceEqual([1, 2, 3]),
      ).equals(true);
    });

    it('should append 1 element', () => {
      expect(
        collect([1, 2, 3])
          .append(4)
          .sequenceEqual([1, 2, 3, 4]),
      ).equals(true);
    });

    it('should append 3 elements', () => {
      expect(
        collect([1, 2, 3])
          .append(4, 5, 6)
          .sequenceEqual([1, 2, 3, 4, 5, 6]),
      ).equals(true);
    });
  });

  describe('appendAsync()', () => {
    it('should append 0 elements', async () => {
      expect(
        await pipe(
          toAsync<number>(),
          appendAsync(),
          sequenceEqual([1, 2, 3]),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should append 1 element', async () => {
      expect(
        await pipe(
          toAsync<number>(),
          appendAsync(4),
          sequenceEqual([1, 2, 3, 4]),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should append 3 elements', async () => {
      expect(
        await pipe(
          toAsync<number>(),
          appendAsync(4, 5, 6),
          sequenceEqual([1, 2, 3, 4, 5, 6]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('AsyncCollection#append()', () => {
    it('should append 0 elements', async () => {
      expect(
        await collect([1, 2, 3])
          .toAsync()
          .append()
          .sequenceEqual([1, 2, 3]),
      ).equals(true);
    });

    it('should append 1 element', async () => {
      expect(
        await collect([1, 2, 3])
          .toAsync()
          .append(4)
          .sequenceEqual([1, 2, 3, 4]),
      ).equals(true);
    });

    it('should append 3 elements', async () => {
      expect(
        await collect([1, 2, 3])
          .toAsync()
          .append(4)
          .sequenceEqual([1, 2, 3, 4]),
      ).equals(true);
    });
  });

  describe('append()', () => {
    it('should append 0 elements', async () => {
      expect(
        pipe(
          append<number>(),
          sequenceEqual([1, 2, 3]),
        )([1, 2, 3]),
      ).equals(true);

      expect(
        await pipe(
          toAsync<number>(),
          append<number>(),
          sequenceEqual([1, 2, 3]),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should append 1 element', async () => {
      expect(
        pipe(
          append(4),
          sequenceEqual([1, 2, 3, 4]),
        )([1, 2, 3]),
      ).equals(true);

      expect(
        await pipe(
          toAsync<number>(),
          append(4),
          sequenceEqual([1, 2, 3, 4]),
        )([1, 2, 3]),
      ).equals(true);
    });

    it('should append 3 elements', async () => {
      expect(
        pipe(
          append(4, 5, 6),
          sequenceEqual([1, 2, 3, 4, 5, 6]),
        )([1, 2, 3]),
      ).equals(true);

      expect(
        await pipe(
          toAsync<number>(),
          append(4, 5, 6),
          sequenceEqual([1, 2, 3, 4, 5, 6]),
        )([1, 2, 3]),
      ).equals(true);
    });
  });
});
