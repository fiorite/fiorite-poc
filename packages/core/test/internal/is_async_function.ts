import { expect } from 'chai';
import { isAsyncFunction } from '../../src/internal';

describe('isAsyncFunction()', () => {
  it('should test different values', () => {
    expect(isAsyncFunction(() => null)).equals(false);
    expect(isAsyncFunction(async () => null)).equals(true);
    expect(isAsyncFunction(function*() { })).equals(false);
    expect(isAsyncFunction(async function*() { })).equals(false);
  })
});
