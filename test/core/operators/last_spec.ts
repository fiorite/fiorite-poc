import { expect } from 'chai';

import { createAsyncIterable, InvalidOperationError, last, lastAsync, pipe, pipeAsync } from '@fiorite/core/operators';

describe('last() / lastAsync()', () => {
  const sequence = [1, 2, 3, 4];

  describe('last()', () => {
    it('should return last element', () => {
      expect(
        pipe(
          last(),
        )(sequence)
      ).equals(4);
    });

    it('should throw error on empty sequence', () => {
      expect(() => {
        pipe(
          last(),
        )([]);
      }).throw(InvalidOperationError);
    });

    it('should return last element with predicate', () => {
      expect(
        pipe(
          last<number>(x => x % 2 === 0),
        )(sequence)
      ).equals(4);
    });

    it('should throw error on negative predicate', () => {
      expect(() => {
        pipe(
          last(x => x === 0),
        )(sequence);
      }).throw(InvalidOperationError);
    });
  });

  describe('lastAsync()', () => {
    it('should return last element', async () => {
      expect(
        await pipeAsync(
          lastAsync(),
        )(createAsyncIterable(sequence))
      ).equals(4);
    });

    it('should throw error on empty sequence', async () => {
      try {
        await pipeAsync(
          lastAsync(),
        )(createAsyncIterable([]));

        expect.fail();
      } catch (e) {
        expect(e).instanceOf(InvalidOperationError);
      }
    });

    it('should return last element with predicate', async () => {
      expect(
        await pipeAsync(
          lastAsync<number>(async x => x % 2 === 0),
        )(createAsyncIterable(sequence))
      ).equals(4);
    });

    it('should throw error on negative predicate', async () => {
      try {
        await pipeAsync(
          lastAsync(async x => x === 0),
        )(createAsyncIterable([]));

        expect.fail();
      } catch (e) {
        expect(e).instanceOf(InvalidOperationError);
      }
    });
  });
});
