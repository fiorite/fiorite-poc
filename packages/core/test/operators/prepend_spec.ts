import { expect } from 'chai';
import { Readable } from 'stream';

import { prepend, prependAsync, prependSync, toArray } from '../../src/operators';
import { AsyncCollection, collect, Collection } from '../../src';

describe('prependSync(), prependAsync(), Collection#prepend(), AsyncCollection#prepend(), prepend()', () => {
  describe('prependSync()', () => {
    function sequenceEquals<E>(actual: Iterable<E>, expected: E[]) {
      expect(toArray()(actual)).members(expected);
    }

    it('should prepend 0 elements', () => {
      sequenceEquals(
        prependSync<number>()([1, 2, 3]),
        [1, 2, 3],
      );
    });

    it('should prepend 1 element', () => {
      sequenceEquals(
        prependSync(4)([1, 2, 3]),
        [4, 1, 2, 3],
      );
    });

    it('should prepend 3 elements', () => {
      sequenceEquals(
        prependSync(4, 5, 6)([1, 2, 3]),
        [4, 5, 6, 1, 2, 3],
      );
    });
  });

  describe('Collection#prepend()', () => {
    function sequenceEquals<E>(actual: Collection<E>, expected: E[]) {
      expect(actual.toArray()).members(expected);
    }

    it('should prepend 0 elements', () => {
      sequenceEquals(
        collect([1, 2, 3]).prepend(),
        [1, 2, 3],
      );
    });

    it('should prepend 1 element', () => {
      sequenceEquals(
        collect([1, 2, 3]).prepend(4),
        [4, 1, 2, 3],
      );
    });

    it('should prepend 3 elements', () => {
      sequenceEquals(
        collect([1, 2, 3]).prepend(4, 5, 6),
        [4, 5, 6, 1, 2, 3],
      );
    });
  });

  describe('prependAsync()', () => {
    async function sequenceEquals<E>(actual: AsyncIterable<E>, expected: E[]) {
      expect(await toArray()(actual)).members(expected);
    }

    function createSequence<E>(elements: E[]): AsyncIterable<E> {
      return Readable.from(elements);
    }

    it('should prepend 0 elements', async () => {
      await sequenceEquals(
        prependAsync<number>()(createSequence([1, 2, 3])),
        [1, 2, 3],
      );
    });

    it('should prepend 1 element', async () => {
      await sequenceEquals(
        prependAsync(4)(createSequence([1, 2, 3])),
        [4, 1, 2, 3],
      );
    });

    it('should prepend 3 elements', async () => {
      await sequenceEquals(
        prependAsync(4, 5, 6)(createSequence([1, 2, 3])),
        [4, 5, 6, 1, 2, 3],
      );
    });
  });

  describe('AsyncCollection#prepend()', () => {
    async function sequenceEquals<E>(actual: AsyncCollection<E>, expected: E[]) {
      expect(await actual.toArray()).members(expected);
    }

    function createCollection<E>(elements: E[]): AsyncCollection<E> {
      return collect<E>(Readable.from(elements));
    }

    it('should prepend 0 elements', async () => {
      await sequenceEquals(
        createCollection([1, 2, 3]).prepend(),
        [1, 2, 3],
      );
    });

    it('should prepend 1 element', async () => {
      await sequenceEquals(
        createCollection([1, 2, 3]).prepend(4),
        [4, 1, 2, 3],
      );
    });

    it('should prepend 3 elements', async () => {
      await sequenceEquals(
        createCollection([1, 2, 3]).prepend(4, 5, 6),
        [4, 5, 6, 1, 2, 3],
      );
    });
  });

  describe('prepend()', () => {
    function syncSequenceEquals<E>(actual: Iterable<E>, expected: E[]) {
      expect(toArray()(actual)).members(expected);
    }

    async function asyncSequenceEquals<E>(actual: AsyncIterable<E>, expected: E[]) {
      expect(await toArray()(actual)).members(expected);
    }

    function createAsyncSequence<E>(elements: E[]): AsyncIterable<E> {
      return Readable.from(elements);
    }

    it('should prepend 0 elements', async () => {
      await syncSequenceEquals(
        prepend<number>()([1, 2, 3]),
        [1, 2, 3],
      );

      await asyncSequenceEquals(
        prepend<number>()(createAsyncSequence([1, 2, 3])),
        [1, 2, 3],
      );
    });

    it('should prepend 1 element', async () => {
      await syncSequenceEquals(
        prepend<number>(4)([1, 2, 3]),
        [4, 1, 2, 3],
      );

      await asyncSequenceEquals(
        prepend<number>(4)(createAsyncSequence([1, 2, 3])),
        [4, 1, 2, 3],
      );
    });

    it('should prepend 3 elements', async () => {
      await syncSequenceEquals(
        prepend<number>(4, 5, 6)([1, 2, 3]),
        [4, 5, 6, 1, 2, 3],
      );

      await asyncSequenceEquals(
        prepend<number>(4, 5, 6)(createAsyncSequence([1, 2, 3])),
        [4, 5, 6, 1, 2, 3],
      );
    });
  });
});
