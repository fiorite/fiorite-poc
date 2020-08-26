// import { collect } from '../../src';
import { tap, toArray } from '../../src/operators';
import { expect } from 'chai';
import { Readable } from 'stream';
import { fail } from 'assert';
import { collect } from '@fiorite/core';

describe('tap()', () => {
  describe('tap(Callback<E, [number]>)', () => {
    it('should return Operator if callback without index is passed', () => {
      const element = 1;
      const sequence = [element];

      let called = false;

      const operator = tap<number>(x => {
        expect(x).equals(element);
        called = true;
      });

      const array = Array.from(operator(sequence));

      expect(array).members([1]);
      expect(called).equals(true);
    });

    it('should return Operator if callback with index is passed', () => {
      const element = 1;
      const sequence = [element];

      let called = false;

      const operator = tap<number>(
        (x, index) => {
          expect(x).equals(element);
          expect(index).equals(0);
          called = true;
        }
      );

      const array = Array.from(operator(sequence));

      expect(array).members([1]);
      expect(called).equals(true);
    });
  });

  describe('tap(AsyncCallback<E, [number]>)', () => {
    it('should throw Error when async callback provided and called on Iterable<E>', async () => {
      const operator = tap<number>(async () => fail());
      expect(() => Array.from((operator as any)([1]))).throw(TypeError);
    });

    it('should return Operator if callback without index is passed', async () => {
      const element = 1;
      const sequence = Readable.from([element]);

      let called = false;

      const operator = tap<number>(
        async x => {
          expect(x).equals(element);
          called = true;
        }
      );

      // expect();

      const array = await toArray(operator(sequence));

      expect(array).members([1]);
      expect(called).equals(true);
    });
  });

  // describe('tap(Iterable<E>, Callback<E, [number]>)', () => {
  // });
  //
  // describe('tap(AsyncIterable<E>, Callback<E, [number]> | AsyncCallback<E, [number]>)', () => {
  // });

  it('Collection#pipe() compatibility', () => {
    let called = false;

    const operator = tap(() => called = true);

    collect([1]).pipe(operator).toArray();
    expect(called).equals(true);
  });

  it('AsyncCollection#pipe() compatibility', async () => {
    let called = false;

    const operator = tap(async () => {
      called = true;
    });

    await collect(Readable.from([1])).pipe(operator).toArray();
    expect(called).equals(true);
  });
});
