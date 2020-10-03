import { expect } from 'chai';

import {
  createAsyncIterable,
  immediateAsync,
  pipe,
  pipeAsync,
  sequenceEqual,
  sequenceEqualAsync,
  tap,
  tapAsync
} from '@fiorite/core/operators';

describe('tap() / tapAsync()', () => {
  describe('tap()', () => {
    it('should store element in buffer', () => {
      const sequence = [1, 2, 3];
      const buffer: number[] = [];

      expect(
        pipe(
          tap<number>(element => buffer.push(element)),
          sequenceEqual(sequence),
        )(sequence)
      ).equals(true)

      expect(buffer).members(sequence);
    });
  });

  describe('tapAsync()', () => {
    it('should store element in buffer without synchronization', async () => {
      const sequence = [1, 2, 3];
      const buffer: number[] = [];

      expect(
        await pipeAsync(
          tapAsync<number>(async e => {
            buffer.push(e);
          }),
          immediateAsync(),
          tapAsync(async e => {
            buffer.push(e);
          }),
          sequenceEqualAsync(sequence),
        )(createAsyncIterable(sequence))
      ).equals(true);

      expect(buffer).members([1, 2, 3, 1, 2, 3]);
    });

    it('should store element in buffer with synchronization', async () => {
      const sequence = [1, 2, 3];
      const buffer: number[] = [];

      expect(
        await pipeAsync(
          tapAsync<number>(async e => {
            buffer.push(e);
          }, true),
          immediateAsync(),
          tapAsync(async e => {
            buffer.push(e);
          }, true),
          sequenceEqualAsync(sequence),
        )(createAsyncIterable(sequence))
      ).equals(true);

      expect(buffer).members([1, 1, 2, 2, 3, 3]);
    });
  });
});
