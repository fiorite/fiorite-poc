import { Equatable } from '@fiorite/core';
import { expect } from 'chai';

const validOther = { };

describe('Equatable', () => {
  it('should test implementor', () => {
    const implementor = new Implementor();

    expect(implementor[Symbol.equals]({ })).equals(false);
    expect(implementor[Symbol.equals](validOther)).equals(true);
  });
});

class Implementor implements Equatable {
  [Symbol.equals](other: unknown): boolean {
    return other === validOther;
  }
}
