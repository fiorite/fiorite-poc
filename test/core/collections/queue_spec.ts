import { expect } from 'chai';

import { Queue } from '../../../packages/core/collections';
import { InvalidOperationError } from '../../../packages/core';

describe('Queue', () => {
  let queue: Queue<number>;

  beforeEach(() => queue = new Queue<number>());

  describe('#[Symbol.toStringTag]', () => {
    it('should equals "Queue"', () => {
      expect(queue[Symbol.toStringTag]).equals('Queue');
    });
  });

  describe('#enqueue()', () => {
    it('should enqueue single element', () => {
      expect(
        queue.enqueue(1).sequenceEqual([1])
      ).equals(true);
    });

    it('should check element position', () => {
      queue.enqueue(0).enqueue(1);
      expect(queue.last()).equals(1);
    });
  });

  describe('#enqueueAll()', () => {
    it('should enqueue iterable', () => {
      expect(
        queue.enqueueAll([1, 2, 3])
          .sequenceEqual([1, 2, 3]),
      ).equals(true);
    });
  });

  describe('#peek()', () => {
    it('should get first element and leave it in queue', () => {
      queue.enqueueAll([1, 2, 3]);

      expect(queue.peek()).equals(1);
      expect(queue.size).equals(3);
    });

    it('should throw error when queue is empty', () => {
      expect(() => queue.peek()).throw(InvalidOperationError);
    });
  });

  describe('#dequeue()', () => {
    it('should get and remove first element', () => {
      queue.enqueueAll([1, 2, 3]);

      expect(queue.dequeue()).equals(1);
      expect(queue.size).equals(2);
    });

    it('should throw error when queue is empty', () => {
      expect(() => queue.dequeue()).throw(InvalidOperationError);
    });
  });

  describe('#hash()', () => {
    it('should test results', () => {
      queue.enqueueAll([1]);

      expect(queue.has(1)).equals(true);
      expect(queue.has(2)).equals(false);
    });
  });

  // TODO: Clone
});
