import { AnyPredicate, AsyncPredicate, Predicate } from '../types';
import { combine, CombinedOperator } from './combine';
import { getAsyncIterator, getIterator } from '../util';
import { AsyncOperator, Operator } from './operator';

/**
 * Counts the number of elements in a sequence.
 *
 * @example ```typescript
 * import { count } from '@fiorite/core/operators';
 * import { Readable } from 'stream';
 *
 * count()([1, 2, 3]); // 3
 * count(x => x === 2)([1, 2, 3]); // 1
 *
 * count()(Readable.from([1, 2, 3])); // [Promise 3]
 * count(x => x === 2)(Readable.from([1, 2, 3])); // [Promise 1]
 * ```
 *
 * @param predicate
 */
export function count<E>(predicate?: Predicate<[E]>): CombinedOperator<E, number, Promise<number>>;

/**
 * Counts the number of elements in a sequence.
 *
 * @example ```typescript
 * import { count } from '@fiorite/core/operators';
 * import { Readable } from 'stream';
 *
 * count(async x => x === 2)(Readable.from([1, 2, 3])); // [Promise 1]
 * ```
 *
 * @param predicate
 */
export function count<E>(predicate: AsyncPredicate<[E]>): AsyncOperator<E, Promise<number>>;

/**
 * @inheritDoc
 */
export function count<E>(...args: any[]) {
  return combine(() => countSync(...args), () => countAsync(...args));
}

/**
 * Counts the number of elements in a sequence.
 *
 * @example ```typescript
 * import { countSync } from '@fiorite/core/operators';
 *
 * const sequence = [1, 2, 3];
 *
 * countSync()(sequence); // 3
 * countSync(x => x === 2)(sequence); // 1
 * ```
 *
 * @param predicate
 */
export function countSync<E>(predicate: Predicate<[E]> = () => true): Operator<E, number> {
  return function (iterable: Iterable<E>): number {
    const iterator = getIterator(iterable);

    let count = 0;
    let result = iterator.next();

    while (!result.done) {
      if (predicate(result.value)) {
        count++;
      }

      result = iterator.next();
    }

    return count;
  };
}

/**
 * Counts the number of elements in a sequence.
 *
 * @example ```typescript
 * import { countAsync } from '@fiorite/core/operators';
 * import { Readable } from 'stream';
 *
 * countAsync()(Readable.from([1, 2, 3])); // [Promise 3]
 * countAsync(x => x === 2)(Readable.from([1, 2, 3])); // [Promise 1]
 * countAsync(async x => x === 2)(Readable.from([1, 2, 3])); // [Promise 1]
 * ```
 *
 * @param predicate
 */
export function countAsync<E>(predicate: AnyPredicate<[E]> = () => true): AsyncOperator<E, Promise<number>> {
  return async function (iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);

    let count = 0;

    let result = await iterator.next();

    while (!result.done) {
      if (await predicate(result.value)) {
        count++;
      }

      result = await iterator.next();
    }

    return count;
  };
}
