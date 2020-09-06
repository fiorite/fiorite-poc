import { elementAt, elementAtAsync, elementAtSync, InvalidOperationError, pipe, toAsync } from '@fiorite/core/operators';
import { expect } from 'chai';

describe('elementAtSync() / elementAtAsync() / elementAt()', () => {
  describe('elementAtSync()', () => {
    it('should throw error when index < 0', () => {
      expect(() => elementAtSync(-1)).throw(InvalidOperationError);
    });

    it('should take element at 0 index', () => {
      expect(
        pipe(
          elementAtSync(0),
        )([1])
      ).equals(1);
    });

    it('should throw error when element is out of range', () => {
      expect(() => {
        elementAtSync(1)([1]);
      }).throw(InvalidOperationError);
    });
  });

  describe('elementAtAsync()', () => {
    it('should throw error when index < 0', () => {
      expect(() => elementAtAsync(-1)).throw(InvalidOperationError);
    });

    it('should take element at 0 index', async () => {
      expect(
        await pipe(
          toAsync(),
          elementAtAsync(0)
        )([1])
      ).equals(1);
    });

    it('should throw error when element is out of range', async () => {
      try {
        await pipe(
          toAsync(),
          elementAtAsync(1)
        )([1]);

        expect.fail();
      } catch (e) {
        expect(e).instanceOf(InvalidOperationError);
      }
    });
  });

  describe('elementAt()', () => {
    it('should throw error when index < 0', () => {
      expect(() => elementAt(-1)).throw(InvalidOperationError);
    });

    it('should take element at 0 index', async () => {
      expect(elementAt(0)([1])).equals(1);

      expect(
        await pipe(
          toAsync(),
          elementAt(0)
        )([1])
      ).equals(1);
    });

    it('should throw error when element is out of range', async () => {
      expect(() => {
        elementAtSync(1)([1]);
      }).throw(InvalidOperationError);

      try {
        await pipe(
          toAsync(),
          elementAt(1)
        )([1])

        expect.fail();
      } catch (e) {
        expect(e).instanceOf(InvalidOperationError);
      }
    });
  });
});
