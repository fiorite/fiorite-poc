import { expect } from 'chai';

import { createAsyncIterable, immediateAsync, pipeAsync, sequenceEqualAsync, tapAsync } from '@fiorite/core/operators';

describe('immediateAsync()', () => {
  it('should test immediate', async () => {
    const sequence = [1, 2, 3];
    const buffer: number[] = [];

    expect(
      await pipeAsync(
        tapAsync<number>(element => {
          buffer.push(element);
        }),
        immediateAsync(),
        tapAsync(element => {
          buffer.push(element);
        }),
        sequenceEqualAsync(sequence),
      )(createAsyncIterable(sequence))
    ).equals(true);

    expect(buffer).members([...sequence, ...sequence]);
  });
});
