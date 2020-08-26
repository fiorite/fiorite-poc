import { AsyncOperator, AsyncPredicate, Operator, Predicate } from '../common';
import { NotImplementedError } from '@fiorite/core';

export function count<E>(): Operator<E, number> & AsyncOperator<E, number>;
export function count<E>(predicate: Predicate<E, [number]>): Operator<E, number> & AsyncOperator<E, number>;
export function count<E>(predicate: AsyncPredicate<E, [number]>): AsyncOperator<E, number>;
export function count<E>(iterable: Iterable<E>): number;
export function count<E>(iterable: AsyncIterable<E>): Promise<number>;
export function count<E>(iterable: Iterable<E>, predicate: Predicate<E, [number]>): number;
export function count<E>(iterable: AsyncIterable<E>, predicate: AsyncPredicate<E, [number]>): Promise<number>;
export function count(...args: unknown[]): unknown {
  throw new NotImplementedError()
}

/**
 * Counts the number of elements in a sequence.
 *
 * @param iterable
 * @param predicate
 */
export function countSync<E>(iterable: Iterable<E>, predicate: Predicate<E, [number]> = () => true): number {
  const iterator = iterable[Symbol.iterator]();

  let count = 0;
  let result = iterator.next();

  if (predicate.length < 2) { // If client don't request index.
    while (!result.done) {
      if ((predicate as Predicate<E>)(result.value)) {
        count++;
      }

      result = iterator.next();
    }
  } else {
    let index = 0;

    while (!result.done) {
      if (predicate(result.value, index)) {
        count++;
      }

      index++;
      result = iterator.next();
    }
  }

  return count;
}

/**
 * Counts the number of elements in a sequence.
 *
 * @param iterable
 * @param predicate
 */
export async function countAsync<E>(iterable: AsyncIterable<E>, predicate: AsyncPredicate<E, [number]> = () => true): Promise<number> {
  const iterator = iterable[Symbol.asyncIterator]();

  let count = 0;
  let result = await iterator.next();

  if (predicate.length < 2) { // If client don't request index.
    while (!result.done) {
      if (await (predicate as AsyncPredicate<E>)(result.value)) {
        count++;
      }

      result = await iterator.next();
    }
  } else {
    let index = 0;

    while (!result.done) {
      if (await predicate(result.value, index)) {
        count++;
      }

      index++;
      result = await iterator.next();
    }
  }

  return count;
}
