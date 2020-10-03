import { expect } from 'chai';

import { createAsyncIterable, pipeAsync, sequenceEqualAsync, timeoutAsync } from '@fiorite/core/operators';

describe('timeoutAsync()', () => {
  function getTime() {
    return new Date().getTime();
  }

  it('should test timeout', async () => {
    const sequence = [1, 2, 3];
    const milliseconds = 10;

    const start = getTime();

    expect(
      await pipeAsync(
        timeoutAsync<number>(milliseconds),
        sequenceEqualAsync(sequence),
      )(createAsyncIterable(sequence)),
    ).equals(true);

    const duration = getTime() - start;

    expect(duration >= milliseconds * sequence.length).equals(true);
  });
});
