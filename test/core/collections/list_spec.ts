import { expect } from 'chai';

import { List } from '../../../packages/core/collections';
import { InvalidOperationError } from '../../../packages/core/functional_types';

describe('List/list()', () => {
  describe('List', () => {
    let instance: List<number>;

    beforeEach(() => instance = new List())

    describe('#add()', () => {
      it('should add element', () => {
        expect(instance.add(1)).equals(instance);
        expect(instance.sequenceEqual([1])).equals(true);
      });
    });

    describe('#addAll()', () => {
      it('should add specified elements', () => {
        expect(instance.addAll([1, 2, 3])).equals(instance);
        expect(instance.sequenceEqual([1, 2, 3])).equals(true);
      });
    });

    describe('#insert()', () => {
      it('should insert element', () => {
        instance.addAll([1, 3]);

        expect(instance.insert(1, 2)).equals(instance);
        expect(instance.sequenceEqual([1, 2, 3])).equals(true);
      });
    });

    describe('#insertAll()', () => {
      it('should insert specified elements', () => {
        instance.addAll([1, 4]);

        expect(instance.insertAll(1, [2, 3])).equals(instance);
        expect(instance.sequenceEqual([1, 2, 3, 4])).equals(true);
      });
    });

    describe('#elementAt()', () => {
      it('should throw error if index is out of range', () => {
        expect(() => instance.elementAt(0)).throw(InvalidOperationError);
      });

      it('should return element on position', () => {
        instance.addAll([1, 4]);

        expect(instance.elementAt(1)).equals(4);
      });
    });

    describe('#reverse()', () => {
      it('should insert specified elements', () => {
        instance.addAll([1, 2, 3]);

        expect(instance.reverse()).equals(instance);
        expect(instance.sequenceEqual([3, 2, 1])).equals(true);
      });
    });

    describe('#replaceAt()', () => {
      it('should replace element', () => {
        instance.addAll([1, 3]);

        expect(instance.replaceAt(1, 2)).equals(instance);
        expect(instance.sequenceEqual([1, 2])).equals(true);
      });
    });

    describe('#replaceRange()', () => {
      it('should replace specified range', () => {
        instance.addAll([1, 3, 4]);

        expect(instance.replaceRange(1, 2, [2, 3])).equals(instance);
        expect(instance.sequenceEqual([1, 2, 3])).equals(true);
      });
    });

    // TODO: Move to Collection
    describe('#indexOf()', () => {
      it('should return -1 if there is not element', () => {
        expect(instance.indexOf(1)).equals(-1);
      });

      it('should find index', () => {
        instance.addAll([1, 2, 2]);

        expect(instance.indexOf(2)).equals(1);
      });
    });

    // TODO: Move to Collection
    describe('#lastIndexOf()', () => {
      it('should return -1 if there is not element', () => {
        expect(instance.lastIndexOf(1)).equals(-1);
      });

      it('should find last index', () => {
        instance.addAll([1, 2, 2]);

        expect(instance.lastIndexOf(2)).equals(2);
      });
    });

    describe('#delete()', () => {
      it('should delete element', () => {
        instance.add(1);

        expect(instance.delete(1)).equals(instance);
        expect(instance.empty).equals(true);
      });
    });

    describe('#deleteAll()', () => {
      it('should delete specified elements', () => {
        instance.addAll([1, 2]);

        expect(instance.deleteAll([1, 2])).equals(instance);
        expect(instance.empty).equals(true);
      });
    });
  });
});
