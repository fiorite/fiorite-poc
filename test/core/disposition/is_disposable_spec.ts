import { isDisposable } from '@fiorite/core';
import { expect } from 'chai';

describe('isDisposable()', () => {
  it('should test two cases: with and without #[Symbol.dispose]() method', () => {
    expect(
      isDisposable({ })
    ).equals(false);

    expect(
      isDisposable({
        [Symbol.dispose]() { }
      })
    ).equals(true);
  });
});
