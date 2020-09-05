import { Disposable } from '@fiorite/core';
import { expect } from 'chai';

describe('Disposable', () => {
  it('should test implementor', () => {
    const implementor = new Implementor();
    expect(implementor.called).equals(false);

    implementor[Symbol.dispose]();
    expect(implementor.called).equals(true);
  });
});

class Implementor implements Disposable {
  called = false;

  [Symbol.dispose]()  {
    this.called = true;
  }
}
