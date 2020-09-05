import { dispose } from '@fiorite/core';
import { expect } from 'chai';

describe('dispose()', () => {
  it('should check whether function calls #[Symbol.dispose]() method', () => {
    let called = false;

    dispose({
      [Symbol.dispose]() {
        called = true;
      }
    });

    expect(called).equals(true);
  });
});
