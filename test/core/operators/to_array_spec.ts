import { expect } from 'chai';
import { Readable } from 'stream';

import { toArray, toArrayAsync } from '../../../packages/core/operators';

describe('toArray()', () => {
  it('should convert Array to Array', () => {
    const sequence = [1, 2, 3];

    const array = toArray()(sequence);

    expect(array).not.equals(sequence);
    expect(array).members(sequence);
  });

  it('should convert Set to Array', () => {
    const sequence = [1, 2, 3];
    const set = new Set(sequence);

    const array = toArray()(set);
    expect(array).members(sequence);
  });
});

describe('toArrayAsync()', () => {
  it('should convert Stream to Array', async () => {
    const sequence = [1, 2, 3];
    const steam = Readable.from(sequence);

    const array = await toArrayAsync<number>()(steam);
    expect(array).members(sequence);
  });
});
