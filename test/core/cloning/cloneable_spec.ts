import { Cloneable } from '@fiorite/core';
import { expect } from 'chai';

describe('Cloneable', () => {
  it('should test implementor', () => {
    const implementor = new Implementor();
    const clone = implementor[Symbol.clone]();

    expect(clone === implementor).equals(false);
  });
});

class Implementor implements Cloneable {
  [Symbol.clone]()  {
    return new Implementor();
  }
}
