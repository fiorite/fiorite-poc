import { appendSync, appendAsync, prepend, prependAsync, toArray, toArrayAsync } from '../../src/operators';
import { expect } from 'chai';
import { Readable } from 'stream';

describe('prepend()', () => {
  it('should prepend 0 elements', () => {
    const sequence = [1, 2, 3];

    expect(
      toArray(
        prepend(sequence),
      ),
    ).members(sequence);
  });

  it('should prepend 1 element', () => {
    const sequence = [1, 2, 3];

    expect(
      toArray(
        prepend(sequence, 4),
      ),
    ).members([4, ...sequence]);
  });

  it('should prepend 3 elements', () => {
    const sequence = [1, 2, 3];

    expect(
      toArray(
        prepend(sequence, 4, 5, 6),
      ),
    ).members([4, 5, 6, ...sequence]);
  });
});

describe('prependAsync()', () => {
  it('should prepend 0 elements', async () => {
    const sequence = [1, 2, 3];

    expect(
      await toArrayAsync(
        prependAsync(
          Readable.from([1, 2, 3]),
        ),
      ),
    ).members(sequence);
  });

  it('should prepend 1 element', async () => {
    const sequence = [1, 2, 3];

    expect(
      await toArrayAsync(
        prependAsync(
          Readable.from([1, 2, 3]), 4,
        ),
      ),
    ).members([4, ...sequence]);
  });

  it('should prepend 3 elements', async () => {
    const sequence = [1, 2, 3];

    expect(
      await toArrayAsync(
        prependAsync(
          Readable.from([1, 2, 3]), 4, 5, 6,
        ),
      ),
    ).members([4, 5, 6, ...sequence]);
  });
});
