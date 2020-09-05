import { expect } from 'chai';

import { isFunction } from '../../../packages/core/types';

describe('isFunction()', () => {
  it('should test different values', () => {
    expect(isFunction(null)).equals(false);
    expect(isFunction(true)).equals(false);
    expect(isFunction(0)).equals(false);
    expect(isFunction('')).equals(false);
    expect(isFunction([])).equals(false);
    expect(isFunction({})).equals(false);
    expect(isFunction(() => null)).equals(true);
    expect(isFunction(async () => null)).equals(true);
  })
});
