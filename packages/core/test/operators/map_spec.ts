import { expect } from 'chai';
import { Readable } from 'stream';

import { mapSync, mapAsync, toArray, toArrayAsync } from '../../src/operators';

describe('map()', () => {
  it('should map Array', () => {
    const sequence = [1, 2, 3];
    const expected = [2, 3, 4];

    let indexing = 0;

    const array = toArray(
      mapSync(sequence, (element, index) => {
        expect(index).equals(indexing);
        indexing++;
        return element + 1;
      })
    );

    expect(array).members(expected);
  });

  it('should map Set', () => {
    const sequence = [1, 2, 3];
    const expected = [2, 3, 4];
    const set = new Set(sequence);

    let indexing = 0;

    const array = toArray(
      mapSync(set, (element, index) => {
        expect(index).equals(indexing);
        indexing++;
        return element + 1;
      })
    );

    expect(array).members(expected);
  });
});

describe('mapAsync()', () => {
  it('should map Stream', async () => {
    const sequence = [1, 2, 3];
    const expected = [2, 3, 4];
    const stream = Readable.from(sequence);

    let indexing = 0;

    const array = await toArrayAsync(
      mapAsync(stream, async (element, index) => {
        expect(index).equals(indexing);
        indexing++;
        return element + 1;
      })
    );

    expect(array).members(expected);
  });
});
