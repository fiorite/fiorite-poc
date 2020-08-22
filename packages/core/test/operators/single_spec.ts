import { expect } from 'chai';
import { Readable } from 'stream';

import { single, singleAsync } from '../../src/operators';
import { InvalidOperationError } from '../../src';

describe('single()', () => {
  it('should throw OperationError when sequence is empty', () => {
    try {
      single([]);
    } catch (error) {
      expect(error).instanceOf(InvalidOperationError);
      return;
    }

    expect.fail();
  });

  it('should return single element', () => {
    const result = single([1]);

    expect(result).equals(1);
  });

  it('should throw OperationError when sequence has more than one element', () => {
    try {
      single([1, 2]);
    } catch (error) {
      expect(error).instanceOf(InvalidOperationError);
      return;
    }

    expect.fail();
  });

  it('should return single element using predicate', () => {
    const result = single([1, 2], x => x === 1);

    expect(result).equals(1);
  });

  it('should throw OperationError when sequence has more than one element using predicate', () => {
    try {
      single([1, 2, 1], x => x === 1);
    } catch (error) {
      expect(error).instanceOf(InvalidOperationError);
      return;
    }

    expect.fail();
  });
});

describe('singleAsync()', () => {
  it('should throw OperationError when sequence is empty', async () => {
    const stream = Readable.from([]);

    try {
      await singleAsync(stream);
    } catch (error) {
      expect(error).instanceOf(InvalidOperationError);
      return;
    }

    expect.fail();
  });

  it('should return single element', async () => {
    const stream = Readable.from([1]);
    const result = await singleAsync(stream);

    expect(result).equals(1);
  });

  it('should throw OperationError when sequence has more than one element', async () => {
    const stream = Readable.from([1, 2]);

    try {
      await singleAsync(stream);
    } catch (error) {
      expect(error).instanceOf(InvalidOperationError);
      return;
    }

    expect.fail();
  });

  it('should return single element using predicate', async () => {
    const stream = Readable.from([1, 2]);
    const result = await singleAsync(stream, async x => x === 1);

    expect(result).equals(1);
  });

  it('should throw OperationError when sequence has more than one element using predicate', async () => {
    const stream = Readable.from([1, 2, 1]);

    try {
      await singleAsync(stream, x => x === 1);
    } catch (error) {
      expect(error).instanceOf(InvalidOperationError);
      return;
    }

    expect.fail();
  });
});
