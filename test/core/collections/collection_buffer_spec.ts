import { expect } from 'chai';

import { CollectionBuffer } from '@fiorite/core/collections';

describe('CollectionBuffer', () => {
  let collection: TestStructure;

  beforeEach(() => collection = new TestStructure());

  describe('#size', () => {
    it('should return buffer length', () => {
      expect(collection.size).equals(0);
      expect(collection.add(1).size).equals(1);
    });
  });

  describe('#empty', () => {
    it('should return true is empty and vice versa', () => {
      expect(collection.empty).equals(true);
      expect(collection.add(1).empty).equals(false);
    });
  });

  describe('#clear()', () => {
    it('should clear buffer', () => {
      expect(collection.add(1).clear().empty).equals(true);
    });
  });

  describe('#[Symbol.clone]()', () => {
    it('should return new instance with the same sequence', () => {
      collection.add(1).add(2).add(3);

      const clone = collection[Symbol.clone]();

      expect(clone).not.equals(collection);
      expect((clone as any).buffer).not.equals((collection as any).buffer);
      expect(clone.sequenceEqual(collection)).equals(true);
    });
  });

  // describe('#[Symbol.dispose]()', () => {
  //   it('should call clear', () => {
  //     collection.add(1)[Symbol.dispose]();
  //     expect(collection.empty).equals(true);
  //   });
  // });

  describe('#[Symbol.iterator]()', () => {
    it('should return buffer iterator', () => {
      expect(
        collection.sequenceEqual(
          collection.add(1),
        ),
      ).equals(true);
    });
  });
});

class TestStructure extends CollectionBuffer<number> {
  constructor() {
    super();
  }

  add(element: number) {
    this.buffer.push(element);

    return this;
  }
}
