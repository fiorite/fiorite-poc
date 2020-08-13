import { expect } from 'chai';
import { Readable } from 'stream';

import { filter, filterAsync, toArray, toArrayAsync } from '../../src/operators';

describe('filter()', () => {
  it('should filter Array', () => {
    const sequence = [1, 2, 3];
    const expected = [2, 3];

    let indexing = 0;

    const array = toArray(
      filter(sequence, (element, index) => {
        expect(index).equals(indexing);
        indexing++;
        return element > 1;
      })
    );

    expect(array).members(expected);
  });

  it('should filter Set', () => {
    const sequence = [1, 2, 3];
    const expected = [2, 3];
    const set = new Set(sequence);

    let indexing = 0;

    const array = toArray(
      filter(set, (element, index) => {
        expect(index).equals(indexing);
        indexing++;
        return element > 1;
      })
    );

    expect(array).members(expected);
  });
});

describe('filterAsync()', () => {
  it('should filter Stream', async () => {
    const sequence = [1, 2, 3];
    const expected = [2, 3];
    const stream = Readable.from(sequence);

    let indexing = 0;

    const array = await toArrayAsync(
      filterAsync<number>(stream, async (element, index) => {
        expect(index).equals(indexing);
        indexing++;
        return element > 1;
      })
    );

    expect(array).members(expected);
  });
});
