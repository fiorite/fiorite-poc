import { expect } from 'chai';

import { isAsyncIterable, sequenceEqualAsync, toAsync } from '@fiorite/core/operators';

describe('toAsync()', () => {
  it('should convert async iterable to sync', async () => {
    const sequence = [1, 2, 3];

    const iterable = toAsync<number>()(sequence);

    expect(isAsyncIterable(iterable)).equals(true);
    expect(await sequenceEqualAsync<number>(sequence)(iterable));
  });
});
