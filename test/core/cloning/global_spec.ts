import '@fiorite/core';
import { expect } from 'chai';

describe('Symbol.clone', () => {
  it('should be the same as Symbol.for(\'clone\')', () => {
    expect(Symbol.clone).equals(Symbol.for('clone'));
  });
});
