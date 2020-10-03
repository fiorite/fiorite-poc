import { expect } from 'chai';

import { createAsyncIterable, isIterable, sequenceEqual, toSync } from '@fiorite/core/operators';

describe('toSync()', () => {
  it('should convert async iterable to sync', async () => {
    const sequence = [1, 2, 3];

    const iterable = await toSync<number>()(
      createAsyncIterable(sequence),
    );

    expect(isIterable(iterable)).equals(true);
    expect(sequenceEqual<number>(sequence)(iterable));
  });
});
