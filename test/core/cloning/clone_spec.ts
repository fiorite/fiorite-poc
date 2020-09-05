import { clone } from '@fiorite/core';
import { expect } from 'chai';

describe('clone()', () => {
  it('should check whether function calls #[Symbol.clone]() method', () => {
    const result = { };

    const cloned = clone({
      [Symbol.clone]() {
        return result;
      }
    });

    expect(result === cloned).equals(true);
  });
});
