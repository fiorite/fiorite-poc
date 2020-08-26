import { expect } from 'chai';
import { isSyncFunction } from '../../src/internal';

describe('isAsyncFunction()', () => {
  it('should test different values', () => {
    expect(isSyncFunction(() => null)).equals(true);
    expect(isSyncFunction(async () => null)).equals(false);
  })
});
