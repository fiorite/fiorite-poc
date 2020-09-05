import { expect } from 'chai';

import { isIterable } from '../../../packages/core/types';

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
