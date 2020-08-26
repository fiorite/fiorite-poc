import { expect } from 'chai';
import { Readable } from 'stream';

import { append, appendAsync, appendSync, toArray } from '../../src/operators';
import { AsyncCollection, collect, Collection } from '../../src';

describe('appendSync(), appendAsync(), Collection#append(), AsyncCollection#append(), append()', () => {
  describe('appendSync()', () => {
    function sequenceEquals<E>(actual: Iterable<E>, expected: E[]) {
      expect(toArray()(actual)).members(expected);
    }

    it('should append 0 elements', () => {
      sequenceEquals(
        appendSync<number>()([1, 2, 3]),
        [1, 2, 3],
      );
    });

    it('should append 1 element', () => {
      sequenceEquals(
        appendSync(4)([1, 2, 3]),
        [1, 2, 3, 4],
      );
    });

    it('should append 3 elements', () => {
      sequenceEquals(
        appendSync(4, 5, 6)([1, 2, 3]),
        [1, 2, 3, 4, 5, 6],
      );
    });
  });

  describe('Collection#append()', () => {
    function sequenceEquals<E>(actual: Collection<E>, expected: E[]) {
      expect(actual.toArray()).members(expected);
    }

    it('should append 0 elements', () => {
      sequenceEquals(
        collect([1, 2, 3]).append(),
        [1, 2, 3],
      );
    });

    it('should append 1 element', () => {
      sequenceEquals(
        collect([1, 2, 3]).append(4),
        [1, 2, 3, 4],
      );
    });

    it('should append 3 elements', () => {
      sequenceEquals(
        collect([1, 2, 3]).append(4, 5, 6),
        [1, 2, 3, 4, 5, 6],
      );
    });
  });

  describe('appendAsync()', () => {
    async function sequenceEquals<E>(actual: AsyncIterable<E>, expected: E[]) {
      expect(await toArray()(actual)).members(expected);
    }

    function createSequence<E>(elements: E[]): AsyncIterable<E> {
      return Readable.from(elements);
    }

    it('should append 0 elements', async () => {
      await sequenceEquals(
        appendAsync<number>()(createSequence([1, 2, 3])),
        [1, 2, 3],
      );
    });

    it('should append 1 element', async () => {
      await sequenceEquals(
        appendAsync(4)(createSequence([1, 2, 3])),
        [1, 2, 3, 4],
      );
    });

    it('should append 3 elements', async () => {
      await sequenceEquals(
        appendAsync(4, 5, 6)(createSequence([1, 2, 3])),
        [1, 2, 3, 4, 5, 6],
      );
    });
  });

  describe('AsyncCollection#append()', () => {
    async function sequenceEquals<E>(actual: AsyncCollection<E>, expected: E[]) {
      expect(await actual.toArray()).members(expected);
    }

    function createCollection<E>(elements: E[]): AsyncCollection<E> {
      return collect<E>(Readable.from(elements));
    }

    it('should append 0 elements', async () => {
      await sequenceEquals(
        createCollection([1, 2, 3]).append(),
        [1, 2, 3],
      );
    });

    it('should append 1 element', async () => {
      await sequenceEquals(
        createCollection([1, 2, 3]).append(4),
        [1, 2, 3, 4],
      );
    });

    it('should append 3 elements', async () => {
      await sequenceEquals(
        createCollection([1, 2, 3]).append(4, 5, 6),
        [1, 2, 3, 4, 5, 6],
      );
    });
  });

  describe('append()', () => {
    function syncSequenceEquals<E>(actual: Iterable<E>, expected: E[]) {
      expect(toArray()(actual)).members(expected);
    }

    async function asyncSequenceEquals<E>(actual: AsyncIterable<E>, expected: E[]) {
      expect(await toArray()(actual)).members(expected);
    }

    function createAsyncSequence<E>(elements: E[]): AsyncIterable<E> {
      return Readable.from(elements);
    }

    it('should append 0 elements', async () => {
      await syncSequenceEquals(
        append<number>()([1, 2, 3]),
        [1, 2, 3],
      );

      await asyncSequenceEquals(
        append<number>()(createAsyncSequence([1, 2, 3])),
        [1, 2, 3],
      );
    });

    it('should append 1 element', async () => {
      await syncSequenceEquals(
        append<number>(4)([1, 2, 3]),
        [1, 2, 3, 4],
      );

      await asyncSequenceEquals(
        append<number>(4)(createAsyncSequence([1, 2, 3])),
        [1, 2, 3, 4],
      );
    });

    it('should append 3 elements', async () => {
      await syncSequenceEquals(
        append<number>(4, 5, 6)([1, 2, 3]),
        [1, 2, 3, 4, 5, 6],
      );

      await asyncSequenceEquals(
        append<number>(4, 5, 6)(createAsyncSequence([1, 2, 3])),
        [1, 2, 3, 4, 5, 6],
      );
    });
  });
});
