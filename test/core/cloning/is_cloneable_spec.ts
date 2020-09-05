import { isCloneable } from '@fiorite/core';
import { expect } from 'chai';

describe('isCloneable()', () => {
  it('should test two cases: with and without #[Symbol.clone]() method', () => {
    expect(
      isCloneable({ })
    ).equals(false);

    expect(
      isCloneable({
        [Symbol.clone]() { }
      })
    ).equals(true);
  });
});
