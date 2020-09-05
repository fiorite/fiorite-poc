import { tryDispose } from '@fiorite/core';
import { expect } from 'chai';

describe('tryDispose()', () => {
  it('should test two cases: with and without #[Symbol.dispose]() method', () => {
    expect(
      tryDispose({ })
    ).equals(false);

    let called = false;

    expect(
      tryDispose({
        [Symbol.dispose]() {
          called = true;
        }
      })
    ).equals(true);

    expect(called).equals(true);
  });
});
