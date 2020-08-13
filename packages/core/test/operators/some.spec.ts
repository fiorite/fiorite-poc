import { expect } from 'chai';
import { Readable } from 'stream';

import { some, someAsync } from '../../src/operators';

describe('some()', () => {
  it('should return false whether Set is empty', () => {
    const set = new Set();
    const result = some(set);

    expect(result).equals(false);
  });

  it('should return true whether Set has at least one element', () => {
    const set = new Set([1]);
    const result = some(set);

    expect(result).equals(true);
  });

  it('should return false whether predicate has no match', () => {
    const set = new Set([1, 2, 3]);
    const result = some(set, x => x === 0);

    expect(result).equals(false);
  });

  it('should return false whether predicate has at least one match', () => {
    const set = new Set([1, 2, 3]);
    const result = some(set, x => x === 1);

    expect(result).equals(true);
  });
});

describe('someAsync()', () => {
  it('should return false whether Stream is empty', async () => {
    const stream = Readable.from([]);
    const result = await someAsync(stream);

    expect(result).equals(false);
  });

  it('should return true whether Stream has at least one element', async () => {
    const stream = Readable.from([1]);
    const result = await someAsync(stream);

    expect(result).equals(true);
  });

  it('should return false whether predicate has no match', async () => {
    const stream = Readable.from([1, 2, 3]);
    const result = await someAsync(stream, async x => x === 0);

    expect(result).equals(false);
  });

  it('should return false whether predicate has at least one match', async () => {
    const stream = Readable.from([1, 2, 3]);
    const result = await someAsync(stream, async x => x === 1);

    expect(result).equals(true);
  });
});
