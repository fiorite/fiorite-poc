import { expect } from "chai";

import { collect } from '@fiorite/core/collections';

describe('Collection<T>', () => {
  describe('#append()', () => {
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

  describe('Collection#cast()', () => {
    it('should cast a sequence', () => {
      expect(
        collect<1 | 2 | 3>([1, 2, 3])
          .cast<number>()
          .sequenceEqual([1, 2, 3])
      ).equals(true);
    });
  });

  describe('AsyncCollection#cast()', () => {
    it('should cast a sequence', async () => {
      expect(
        await collect<1 | 2 | 3>([1, 2, 3])
          .toAsync()
          .cast<number>()
          .sequenceEqual([1, 2, 3])
      ).equals(true);
    });
  });

  describe('Collection#concat()', () => {
    it('should concatenate with 0 sequences', () => {
      expect(
        collect<number>([1, 2, 3])
          .concat()
          .sequenceEqual([1, 2, 3]),
      ).equals(true);
    });

    it('should concatenate with 1 sequence', () => {
      expect(
        collect<number>([1, 2, 3])
          .concat([4, 5, 6])
          .sequenceEqual([1, 2, 3, 4, 5, 6]),
      ).equals(true);
    });

    it('should concatenate with 2 sequences', () => {
      expect(
        collect<number>([1, 2, 3])
          .concat([4, 5, 6], [7, 8, 9])
          .sequenceEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]),
      ).equals(true);
    });
  });

  describe('AsyncCollection#concat()', () => {
    it('should concatenate with 0 sequences', async () => {
      expect(
        await collect<number>([1, 2, 3])
          .toAsync()
          .concat()
          .sequenceEqual([1, 2, 3]),
      ).equals(true);
    });

    it('should concatenate with 1 sequence', async () => {
      expect(
        await collect<number>([1, 2, 3])
          .toAsync()
          .concat([4, 5, 6])
          .sequenceEqual([1, 2, 3, 4, 5, 6]),
      ).equals(true);
    });

    it('should concatenate with 2 sequences', async () => {
      expect(
        await collect<number>([1, 2, 3])
          .toAsync()
          .concat([4, 5, 6], [7, 8, 9])
          .sequenceEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]),
      ).equals(true);
    });
  });


  describe('Collection#skip()', () => {
    it('should skip 2 elements', () => {
      expect(
        collect([1, 2, 3])
          .skip(2)
          .sequenceEqual([3]),
      ).equals(true);
    });
  });


  describe('AsyncCollection#skip()', () => {
    it('should skip 2 elements', async () => {
      expect(
        await collect([1, 2, 3])
          .toAsync()
          .skip(2)
          .sequenceEqual([3]),
      ).equals(true);
    });
  });


  describe('Collection#take()', () => {
    it('should take 2 elements', () => {
      expect(
        collect([1, 2, 3])
          .take(2)
          .sequenceEqual([1, 2]),
      ).equals(true);
    });
  });


  describe('AsyncCollection#take()', () => {
    it('should take 2 elements', async () => {
      expect(
        await collect([1, 2, 3])
          .toAsync()
          .take(2)
          .sequenceEqual([1, 2]),
      ).equals(true);
    });
  });

  describe('Collection#every()', () => {
    it('should return true on 0 elements', () => {
      expect(
        collect([])
          .every(() => false),
      ).equals(true);
    });

    it('should true when predicate is positive', () => {
      expect(
        collect<unknown>([1, 2, 3])
          .every(x => typeof x === 'number'),
      ).equals(true);
    });

    it('should false when predicate is negative', () => {
      expect(
        collect<unknown>([1, 2, 3])
          .every(x => x === 2),
      ).equals(false);
    });
  });

  describe('AsyncCollection#every()', () => {
    it('should return true on 0 elements', async () => {
      expect(
        await collect([])
          .toAsync()
          .every(async () => false),
      ).equals(true);
    });

    it('should true when predicate is positive', async () => {
      expect(
        await collect<unknown>([1, 2, 3])
          .toAsync()
          .every(async x => typeof x === 'number'),
      ).equals(true);
    });

    it('should false when predicate is negative', async () => {
      expect(
        await collect<unknown>([1, 2, 3])
          .toAsync()
          .every(async x => x === 2),
      ).equals(false);
    });
  });

});
