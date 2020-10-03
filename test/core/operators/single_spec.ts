import { expect } from 'chai';

import {
  createAsyncIterable,
  InvalidOperationError,
  pipe,
  pipeAsync,
  single,
  singleAsync
} from '@fiorite/core/operators';

describe('single() / singleAsync()', () => {
  describe('single()', () => {
    it('should throw OperationError when sequence is empty', () => {
      expect(() => {
        pipe(
          single(),
        )([]);
      }).throw(InvalidOperationError);
    });

    it('should return single element', () => {
      expect(
        pipe(
          single(),
        )([1]),
      ).equals(1);
    });

    it('should throw OperationError when sequence has more than one element', () => {
      expect(() => {
        pipe(
          single(),
        )([1, 2]);
      }).throw(InvalidOperationError);
    });

    it('should return single element using predicate', () => {
      expect(
        pipe(
          single(x => x === 1),
        )([1, 2]),
      ).equals(1);
    });

    it('should throw OperationError when sequence has more than one element using predicate', () => {
      expect(() => {
        pipe(
          single(x => x === 1),
        )([1, 2, 1]);
      }).throw(InvalidOperationError);
    });
  });

  describe('singleAsync()', () => {
    it('should throw OperationError when sequence is empty', async () => {
      try {
        await pipeAsync(
          singleAsync(),
        )(createAsyncIterable([]));

        expect.fail();
      } catch (e) {
        expect(e).instanceOf(InvalidOperationError);
      }
    });

    it('should return single element', async () => {
      expect(
        await pipeAsync(
          singleAsync(),
        )(createAsyncIterable([1])),
      ).equals(1);
    });

    it('should throw OperationError when sequence has more than one element', async () => {
      try {
        await pipeAsync(
          singleAsync(),
        )(createAsyncIterable([1, 2]));

        expect.fail();
      } catch (e) {
        expect(e).instanceOf(InvalidOperationError);
      }
    });

    it('should return single element using predicate', async () => {
      expect(
        await pipeAsync(
          singleAsync(async x => x === 1),
        )(createAsyncIterable([1, 2])),
      ).equals(1);
    });

    it('should throw OperationError when sequence has more than one element using predicate', async () => {
      try {
        await pipeAsync(
          singleAsync(async x => x === 1),
        )(createAsyncIterable([1, 2, 1]));

        expect.fail();
      } catch (e) {
        expect(e).instanceOf(InvalidOperationError);
      }
    });
  });

});
