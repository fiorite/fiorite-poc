import { expect } from 'chai';

import { Stack } from '../../../packages/core/collections';
import { InvalidOperationError } from '../../../packages/core';

describe('Stack', () => {
  let stack: Stack<number>;

  beforeEach(() => stack = new Stack<number>());

  describe('#[Symbol.toStringTag]', () => {
    it('should equals "Stack"', () => {
      expect(stack[Symbol.toStringTag]).equals('Stack');
    });
  });

  describe('#push()', () => {
    it('should push single element', () => {
      expect(
        stack.push(1).sequenceEqual([1])
      ).equals(true);
    });

    it('should check element position', () => {
      stack.push(0).push(1);
      expect(stack.last()).equals(1);
    });
  });

  describe('#pushAll()', () => {
    it('should push iterable', () => {
      expect(
        stack.pushAll([1, 2, 3])
          .sequenceEqual([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('#peek()', () => {
    it('should get first element and leave it in stack', () => {
      stack.pushAll([1, 2, 3]);

      expect(stack.peek()).equals(3);
      expect(stack.size).equals(3);
    });

    it('should throw error when stack is empty', () => {
      expect(() => stack.peek()).throw(InvalidOperationError);
    });
  });

  describe('#pop()', () => {
    it('should get and remove first element', () => {
      stack.pushAll([1, 2, 3]);

      expect(stack.pop()).equals(3);
      expect(stack.size).equals(2);
    });

    it('should throw error when stack is empty', () => {
      expect(() => stack.pop()).throw(InvalidOperationError);
    });
  });

  describe('#hash()', () => {
    it('should test results', () => {
      stack.pushAll([1]);

      expect(stack.has(1)).equals(true);
      expect(stack.has(2)).equals(false);
    });
  });

  // TODO: Clone
});
