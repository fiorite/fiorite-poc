import '@fiorite/core';
import { expect } from 'chai';

describe('Symbol.dispose', () => {
  it('should be the same as Symbol.for(\'dispose\')', () => {
    expect(Symbol.dispose).equals(Symbol.for('dispose'));
  });
});
