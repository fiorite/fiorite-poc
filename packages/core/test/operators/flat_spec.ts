import { expect } from 'chai';
import { Readable } from 'stream';

import { flat, flatAsync, toArray, toArrayAsync } from '../../src/operators';

describe('flat()', () => {
  it('should return [1, 2, 3] on Array [[1], [2], 3]', () => {
    const sequence = new Set([[1], [2], 3]);
    const expected = [1, 2, 3];

    const result = toArray(flat(sequence));

    expect(result).members(expected);
  });

  it('should return [1, 2, 3] on Set [[1], [2], 3]', () => {
    const sequence = new Set([[1], [2], 3]);
    const expected = [1, 2, 3];

    const result = toArray(flat(sequence));

    expect(result).members(expected);
  });
});

describe('flatAsync()', () => {
  it('should return [1, 2, 3] on Stream [Stream [1], [2], 3]', async () => {
    const sequence = Readable.from([Readable.from([1]), [2], 3]);
    const expected = [1, 2, 3];

    const result = await toArrayAsync(flatAsync(sequence));

    expect(result).members(expected);
  });
});
