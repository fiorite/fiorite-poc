import { includes, includesAsync } from '../../src/operators';
import { expect } from 'chai';
import { Readable } from 'stream';

describe('includes()', () => {
  it('should return true if element is in a sequence', () => {
    const sequence = [1, 2, 3];
    const set = new Set(sequence);

    const result = includes(set, 2);
    expect(result).equals(true);
  });

  it('should return false if element is not in a sequence', () => {
    const sequence = [1, 2, 3];
    const set = new Set(sequence);

    const result = includes(set, 0);
    expect(result).equals(false);
  });

  it('should return true if element is not in a sequence and comparer ignores it', () => {
    const result = includes([0], -1, () => true);
    expect(result).equals(true);
  });
});

describe('includesAsync()', () => {
  it('should return true if element is in a sequence', async () => {
    const sequence = [1, 2, 3];
    const stream = Readable.from(sequence);

    const result = await includesAsync(stream, 2);
    expect(result).equals(true);
  });

  it('should return false if element is not in a sequence', async () => {
    const sequence = [1, 2, 3];
    const stream = Readable.from(sequence);

    const result = await includesAsync(stream, 0);
    expect(result).equals(false);
  });

  it('should return true if element is not in a sequence and comparer ignores it', async () => {
    const stream = Readable.from([0]);

    const result = await includesAsync(stream, -1, () => true);
    expect(result).equals(true);
  });
});
