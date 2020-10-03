import { expect } from 'chai';

import {
  createAsyncIterable,
  first,
  firstAsync,
  InvalidOperationError,
  pipe,
  pipeAsync
} from '@fiorite/core/operators';

describe('first() / firstAsync()', () => {
  const sequence = [1, 2, 3];

  describe('first()', () => {
    it('should return first element', () => {
      expect(
        pipe(
          first(),
        )(sequence)
      ).equals(1);
    });

    it('should throw error on empty sequence', () => {
      expect(() => {
        pipe(
          first(),
        )([]);
      }).throw(InvalidOperationError);
    });

    it('should return first element with predicate', () => {
      expect(
        pipe(
          first(x => x === 2),
        )(sequence)
      ).equals(2);
    });

    it('should throw error on negative predicate', () => {
      expect(() => {
        pipe(
          first(x => x === 0),
        )(sequence);
      }).throw(InvalidOperationError);
    });
  });

  describe('firstAsync()', () => {
    it('should return first element', async () => {
      expect(
        await pipeAsync(
          firstAsync(),
        )(createAsyncIterable(sequence))
      ).equals(1);
    });

    it('should throw error on empty sequence', async () => {
      try {
        await pipeAsync(
          firstAsync(),
        )(createAsyncIterable([]));

        expect.fail();
      } catch (e) {
        expect(e).instanceOf(InvalidOperationError);
      }
    });

    it('should return first element with predicate', async () => {
      expect(
        await pipeAsync(
          firstAsync(async x => x === 2),
        )(createAsyncIterable(sequence))
      ).equals(2);
    });

    it('should throw error on negative predicate', async () => {
      try {
        await pipeAsync(
          firstAsync(async x => x === 0),
        )(createAsyncIterable([]));

        expect.fail();
      } catch (e) {
        expect(e).instanceOf(InvalidOperationError);
      }
    });
  });
});
