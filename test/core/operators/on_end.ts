import { expect } from 'chai';

import {
  createAsyncIterable,
  onDone,
  onDoneAsync,
  pipe,
  pipeAsync,
  sequenceEqual,
  sequenceEqualAsync,
  tap,
  tapAsync,
} from '@fiorite/core/operators';

describe('onEnd() / onEndAsync()', () => {
  describe('onEnd()', () => {
    it('should test on end', next => {
      const sequence = [1, 2, 3];
      const buffer: number[] = [];

      pipe(
        onDone<number>(() => {
          expect(buffer).members(sequence);
          next();
        }),
        tap(element => buffer.push(element)),
        sequenceEqual(sequence),
      )(sequence);
    });
  });

  describe('onEndAsync()', () => {
    it('should test on end', next => {
      const sequence = [1, 2, 3];
      const buffer: number[] = [];

      pipeAsync(
        onDoneAsync<number>(() => {
          expect(buffer).members(sequence);
          next();
        }),
        tapAsync(async element => buffer.push(element)),
        sequenceEqualAsync(sequence),
      )(createAsyncIterable(sequence));
    });
  });
});
