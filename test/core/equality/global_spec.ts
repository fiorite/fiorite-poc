import '@fiorite/core';
import { expect } from 'chai';

describe('Symbol.equals', () => {
  it('should be the same as Symbol.for(\'equals\')', () => {
    expect(Symbol.equals).equals(Symbol.for('equals'));
  });
});
