import { expect } from "chai";

import {
  AsyncCollection,
  Collection,
  createAsyncIterable,
  defaultIterable,
  InvalidOperationError
} from '@fiorite/core/collections';
import { EqualityComparer, equals } from '@fiorite/core';

describe('Collection<E>', () => {
  function createCollection<E>(iterable: Iterable<E>) {
    return new Collection(iterable);
  }

  describe('static #[Symbol.species]', () => {
    it('should be Collection', function () {
      expect(Collection[Symbol.species]).equals(Collection);
    });
  });

  describe('#[Symbol.toStringTag]', () => {
    it('should be "Collection"', function () {
      const collection = new Collection();
      expect(collection[Symbol.toStringTag]).equals('Collection');
    });
  });

  describe('#iterable', () => {
    it('should be defaultIterable', function () {
      const collection = new Collection();
      expect(collection.iterable).equals(defaultIterable);
    });

    it('should be provided iterable', function () {
      const iterable: Iterable<unknown> = [];
      const collection = new Collection(iterable);
      expect(collection.iterable).equals(iterable);
    });
  });

  describe('#comparer', () => {
    it('should be equals()', function () {
      const collection = new Collection();
      expect(collection.comparer).equals(equals);
    });

    it('should be provided comparer', function () {
      const comparer: EqualityComparer = () => false;
      const collection = new Collection([], comparer);
      expect(collection.comparer).equals(comparer);
    });
  });

  describe('#empty', () => {
    it('should return true on empty sequence', function () {
      const collection = new Collection([]);
      expect(collection.empty).equals(true);
    });

    it('should return false on non-empty sequence', function () {
      const collection = new Collection([1]);
      expect(collection.empty).equals(false);
    });
  });

  describe('#append()', () => {
    it('should return the same sequence on zero elements', function () {
      const collection = new Collection([]);
      expect(collection.append()).equals(collection);
    });

    it('should return a new sequence', function () {
      const collection = new Collection<number>([1]);
      const appended = collection.append(2, 3);
      expect(appended).not.equals(collection);
      expect(appended.sequenceEqual([1, 2, 3]));
    });
  });

  describe('#average()', () => {
    it('should return 2 on sequence [1, 2, 3]', function () {
      const collection = new Collection([1, 2, 3]);
      expect(collection.average()).equals(2);
    });

    it('should return 2 on sequence [[1], [2], [3]] with selector', function () {
      const collection = new Collection([[1], [2], [3]]);
      expect(collection.average(x => x[0])).equals(2);
    });
  });

  describe('#cast()', () => {
    it('should return the same sequence', function () {
      const collection = new Collection<number>([]);
      expect(collection.cast<string>()).equals(collection);
    });
  });

  describe('#concat()', () => {
    it('should return Collection on Iterable', function () {
      const collection = new Collection<number>([1]);
      const result = collection.concat([2, 3]);
      expect(result).instanceOf(Collection);
      expect(result.sequenceEqual([1, 2, 3])).equals(true);
    });

    it('should return AsyncCollection on AsyncIterable', async function () {
      const collection = new Collection<number>([1]);
      const result = collection.concat(createAsyncIterable([2, 3]));
      expect(result).instanceOf(AsyncCollection);
      expect(await result.sequenceEqual([1, 2, 3])).equals(true);
    });
  });

  describe('#count()', () => {
    it('should count without predicate', function () {
      const collection = new Collection<number>([1]);
      const result = collection.count();
      expect(result).equals(1);
    });

    it('should count with predicate', async function () {
      const collection = new Collection([1, 2, 3]);
      const result = collection.count(x => x % 2 === 0);
      expect(result).equals(1);
    });
  });

  describe('#distinct()', () => {
    it('should distinct with default comparer', function () {
      const collection = new Collection<number>([1, 1]);
      const result = collection.distinct();
      expect(
        result.sequenceEqual([1]),
      ).equals(true);
    });

    it('should count with custom comparer', async function () {
      const collection = new Collection([1, 2, 3]);
      const result = collection.distinct(() => true);
      expect(result.sequenceEqual([1])).equals(true);
    });
  });

  describe('#elementAt()', () => {
    it('should throw an error when index is out of range', function () {
      const collection = new Collection<number>([]);
      expect(() => collection.elementAt(0)).throw(InvalidOperationError);
    });

    it('should count with predicate', async function () {
      const collection = new Collection<number>([1]);
      expect(collection.elementAt(0)).equals(1);
    });
  });

  describe('#every()', () => {
    it('should return true on right predicate', function () {
      const collection = new Collection<number>([1, 2, 3]);
      expect(collection.every(x => typeof x === 'number')).equals(true);
    });

    it('should return false on wrong predicate', function () {
      const collection = new Collection<number>([1, 2, 3]);
      expect(collection.every(x => x === 2)).equals(false);
    });
  });

  describe('#except()', () => {
    it('should return a new collection that ignore some elements', function () {
      const collection = new Collection<number>([1, 2, 3]);
      const result = collection.except([1, 2]);
      expect(result).instanceOf(Collection);
      expect(result.sequenceEqual([3])).equals(true);
    });

    it('should return a new collection with custom comparer', function () {
      const collection = new Collection<number>([1, 2, 3]);
      const result = collection.except([1, 2], () => true);
      expect(result).instanceOf(Collection);
      expect(result.empty).equals(true);
    });

    it('should return a new async collection that ignore some async elements', async function () {
      const collection = new Collection<number>([1, 2, 3]);
      const result = collection.except(createAsyncIterable([1, 2]));
      expect(result).instanceOf(AsyncCollection);
      expect(await result.sequenceEqual([3])).equals(true);
    });

    it('should return a new async collection that ignore some async elements', async function () {
      const collection = new Collection<number>([1, 2, 3]);
      const result = collection.except(createAsyncIterable([1, 2]), () => true);
      const arr = await result.toArray();
      expect(result).instanceOf(AsyncCollection);
      expect(await result.empty).equals(true);
    });
  });

  describe('#filter()', () => {
    it('should filter elements', function () {
      const collection = new Collection<number>([1, 2, 3]);
      const result = collection.filter(x => x === 2);
      expect(result.sequenceEqual([2])).equals(true);
    });
  });

  describe('#first()', () => {
    it('should throw error without predicate', function () {
      const collection = new Collection([]);
      expect(() => {
        collection.first();
      }).throws(InvalidOperationError);
    });

    it('should return first element', function () {
      const collection = new Collection([1]);
      expect(collection.first()).equals(1);
    });

    it('should throw error with predicate', function () {
      const collection = new Collection([1]);
      expect(() => {
        collection.first(x => x === 2);
      }).throws(InvalidOperationError);
    });

    it('should return first element', function () {
      const collection = new Collection([1, 2]);
      expect(collection.first(x => x === 2)).equals(2);
    });
  });

  describe('#flat()', () => {
    it('should return the same sequence', function () {
      const collection = new Collection([1, 2, 3]);
      const result = collection.flat();

      expect(result.sequenceEqual([1, 2, 3])).equals(true);
    });

    it('should return the flatten sequence', function () {
      const collection = new Collection([[1, 2], [3]]);
      const result = collection.flat();

      expect(result.sequenceEqual([1, 2, 3])).equals(true);
    });
  });

  describe('#flatMap()', () => {
    it('should return the same sequence', function () {
      const collection = new Collection([1, 2, 3]);
      const result = collection.flatMap(x => x);

      expect(result.sequenceEqual([1, 2, 3])).equals(true);
    });

    it('should return the flatten sequence', function () {
      const collection = new Collection([[1, 2], [3]]);
      const result = collection.flatMap(x => x);

      expect(result.sequenceEqual([1, 2, 3])).equals(true);
    });
  });

  describe('#forEach()', () => {
    it('should aggregate sequence', function () {
      const collection = new Collection([1, 2, 3]);
      const buffer: number[] = [];

      collection.forEach(x => buffer.push(x));

      expect(collection.sequenceEqual(buffer)).equals(true);
    });
  });

  describe('#includes()', () => {
    it('should return false with default comparer', function () {
      const collection = new Collection([1]);
      expect(collection.includes(2)).equals(false);
    });

    it('should return true with default comparer', function () {
      const collection = new Collection([1]);
      expect(collection.includes(1)).equals(true);
    });

    it('should return true with custom comparer', function () {
      const collection = new Collection([1]);
      expect(collection.includes(2, () => true)).equals(true);
    });
  });

  describe('#indexOf()', () => {
    it('should return -1 when element is missed', function () {
      const collection = new Collection([1]);
      expect(collection.indexOf(2)).equals(-1);
    });

    it('should return 0 when element exists', function () {
      const collection = new Collection([1]);
      expect(collection.indexOf(1)).equals(0);
    });

    it('should return 0 when element missed and comparer returns true', function () {
      const collection = new Collection([1]);
      expect(collection.indexOf(2, () => true)).equals(0);
    });
  });

  describe('#intersect()', () => {
    it('should return similar elements with default comparer', function () {
      const collection = new Collection([1, 2, 3]);
      const result = collection.intersect([1, 2]);
      expect(result).instanceOf(Collection);
      expect(result.sequenceEqual([1, 2])).equals(true);
    });

    it('should return similar elements with custom comparer', function () {
      const collection = new Collection([1, 2, 3]);
      const result = collection.intersect([1, 2], () => true);
      expect(result).instanceOf(Collection);
      expect(result.sequenceEqual([1, 2, 3])).equals(true);
    });

    it('should return similar elements with default comparer', async function () {
      const collection = new Collection([1, 2, 3]);
      const result = collection.intersect(createAsyncIterable([1, 2]));
      expect(result).instanceOf(AsyncCollection);
      expect(await result.sequenceEqual([1, 2])).equals(true);
    });

    it('should return similar elements with custom comparer', async function () {
      const collection = new Collection([1, 2, 3]);
      const result = collection.intersect(createAsyncIterable([1, 2]), () => true);
      expect(result).instanceOf(AsyncCollection);
      expect(await result.sequenceEqual([1, 2, 3])).equals(true);
    });
  });
});
