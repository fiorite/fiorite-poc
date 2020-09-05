import { expect } from 'chai';
import { Readable } from 'stream';

import { forEachSync, forEachAsync } from '../../src/operators';

describe('forEach()', () => {
  it('should iterate Array', () => {
    const sequence = [1, 2, 3];

    let count = 0;

    forEachSync(sequence, (element, index) => {
      expect(element).equals(sequence[index]);
      count++;
    });

    expect(count).equals(3);
  });

  it('should iterate Set', () => {
    const sequence = [1, 2, 3];
    const set = new Set(sequence);

    let count = 0;

    forEachSync(set, (element, index) => {
      expect(element).equals(sequence[index]);
      count++;
    });

    expect(count).equals(3);
  });
});

describe('forEachAsync()', () => {
  it('should iterate Stream', async () => {
    const array = [1, 2, 3];
    const stream = Readable.from(array);

    let count = 0;

    await forEachAsync<number>(stream, async (element, index) => {
      expect(element).equals(array[index]);
      count++;
    });

    expect(count).equals(3);
  });
});
