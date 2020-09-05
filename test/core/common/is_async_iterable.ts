import { expect } from 'chai';

import { isAsyncIterable } from '../../../packages/core/types';

describe('isAsyncIterable()', () => {
  it('should test different values', () => {
    expect(
      isAsyncIterable({ [Symbol.asyncIterator]: null })
    ).equals(false);

    expect(
      isAsyncIterable({ async [Symbol.asyncIterator]() { } })
    ).equals(false);

    expect(
      isAsyncIterable({ [Symbol.asyncIterator]() { } })
    ).equals(true);

    expect(
      isAsyncIterable({ async *[Symbol.asyncIterator]() { } })
    ).equals(true);
  })
});
