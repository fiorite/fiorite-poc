import { expect } from 'chai';
import { isAsyncIterable, isIterable } from '../../src/internal';

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
