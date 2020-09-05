import { isEquatable } from '@fiorite/core';
import { expect } from 'chai';

describe('isEquatable()', () => {
  it('should return false is object has no [Symbol.equals] method', () => {
    expect(
      isEquatable({ }),
    ).equals(false);
  });

  it('should return true is object has [Symbol.equals] method', () => {
    expect(
      isEquatable({
        [Symbol.equals]() { }
      }),
    ).equals(true);
  });
});
