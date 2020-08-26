import { appendSync, appendAsync, toArray, toArrayAsync } from '../../src/operators';
import { expect } from 'chai';
import { Readable } from 'stream';

describe('append()', () => {
  it('should append 0 elements', () => {
    const sequence = [1, 2, 3];

    expect(
      toArray(
        appendSync(sequence),
      ),
    ).members(sequence);
  });

  it('should append 1 element', () => {
    const sequence = [1, 2, 3];

    expect(
      toArray(
        appendSync(sequence, 4),
      ),
    ).members([...sequence, 4]);
  });

  it('should append 3 elements', () => {
    const sequence = [1, 2, 3];

    expect(
      toArray(
        appendSync(sequence, 4, 5, 6),
      ),
    ).members([...sequence, 4, 5, 6]);
  });
});

describe('appendAsync()', () => {
  it('should append 0 elements', async () => {
    const sequence = [1, 2, 3];

    expect(
      await toArrayAsync(
        appendAsync(
          Readable.from([1, 2, 3]),
        ),
      ),
    ).members(sequence);
  });

  it('should append 1 element', async () => {
    const sequence = [1, 2, 3];

    expect(
      await toArrayAsync(
        appendAsync(
          Readable.from([1, 2, 3]), 4,
        ),
      ),
    ).members([...sequence, 4]);
  });

  it('should append 3 elements', async () => {
    const sequence = [1, 2, 3];

    expect(
      await toArrayAsync(
        appendAsync(
          Readable.from([1, 2, 3]), 4, 5, 6,
        ),
      ),
    ).members([...sequence, 4, 5, 6]);
  });
});
