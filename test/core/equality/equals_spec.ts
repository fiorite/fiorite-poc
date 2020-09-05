import { equals, Equatable } from '@fiorite/core';
import { expect } from 'chai';

const validOther = { };

describe('equals()', () => {
  it('should test if arguments have not implement Equatable', () => {
    expect(equals(1, 2)).equals(false);
    expect(equals(1, 1)).equals(true);
  });

  it('should test if first or second argument implements Equatable', () => {
    const implementor = new Implementor();

    expect(equals(implementor, validOther)).equals(true);
    expect(equals(validOther, implementor)).equals(true);
    expect(equals(implementor, { })).equals(false);
  });
});

class Implementor implements Equatable {
  [Symbol.equals](other: unknown): boolean {
    return other === validOther;
  }
}
