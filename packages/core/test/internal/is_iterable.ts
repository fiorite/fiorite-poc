import { expect } from 'chai';
import { isIterable } from '../../src/internal';

describe('isIterable()', () => {
  it('should test different values', () => {
    expect(
      isIterable({ [Symbol.iterator]: null })
    ).equals(false);

    expect(
      isIterable({ async [Symbol.iterator]() { } })
    ).equals(false);

    expect(
      isIterable({ [Symbol.iterator]() { } })
    ).equals(true);
  })
});
