import { expect } from 'chai';

import { createAsyncIterable, forEach, forEachAsync, pipe, pipeAsync, sequenceEqual } from '@fiorite/core/operators';

describe('forEach() / forEachAsync()', () => {
  const sequence = [1, 2, 3];

  describe('forEach()', () => {
    it('should iterate', () => {
      const buffer: number[] = [];

      pipe(
        forEach<number>(element => buffer.push(element)),
      )(sequence);

      expect(
        sequenceEqual(sequence)(buffer)
      ).equals(true);
    });
  });

  describe('forEachAsync()', () => {
    it('should iterate without sync', async () => {
      const buffer: number[] = [];

      await pipeAsync(
        forEachAsync<number>(element => {
          return new Promise(resolve => setTimeout(() => {
            resolve();
            buffer.push(element);
          }, 0));
        }),
      )(createAsyncIterable(sequence));

      expect(
        await sequenceEqual(sequence)(buffer)
      ).equals(false);
    });

    it('should iterate with sync', async () => {
      const buffer: number[] = [];

      await pipeAsync(
        forEachAsync<number>(element => {
          return new Promise(resolve => setTimeout(() => {
            resolve();
            buffer.push(element);
          }, 0));
        }, true),
      )(createAsyncIterable(sequence));

      expect(
        await sequenceEqual(sequence)(buffer)
      ).equals(true);
    });
  });
});
