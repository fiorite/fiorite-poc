import { expect } from 'chai';

import {
  createAsyncIterable,
  elementAt,
  elementAtAsync,
  InvalidOperationError,
  pipe,
  pipeAsync
} from '@fiorite/core/operators';

describe('elementAt() / elementAtAsync()', () => {
  describe('elementAt()', () => {
    it('should throw error when index < 0', () => {
      expect(() => elementAt(-1)).throw(InvalidOperationError);
    });

    it('should take element at 0 index', () => {
      expect(
        pipe(
          elementAt(0),
        )([1])
      ).equals(1);
    });

    it('should throw error when element is out of range', () => {
      expect(() => {
        elementAt(1)([1]);
      }).throw(InvalidOperationError);
    });
  });

  describe('elementAtAsync()', () => {
    it('should throw error when index < 0', () => {
      expect(() => elementAtAsync(-1)).throw(InvalidOperationError);
    });

    it('should take element at 0 index', async () => {
      expect(
        await pipeAsync(
          elementAtAsync(0)
        )(createAsyncIterable([1])),
      ).equals(1);
    });

    it('should throw error when element is out of range', async () => {
      try {
        await pipeAsync(
          elementAtAsync(1)
        )(createAsyncIterable([1]));

        expect.fail();
      } catch (e) {
        expect(e).instanceOf(InvalidOperationError);
      }
    });
  });
});
