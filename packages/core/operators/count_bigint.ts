import { AnyPredicate, AsyncPredicate, Predicate } from '../types';
import { combine, CombinedOperator } from './combine';
import { getAsyncIterator, getIterator } from '../util';
import { AsyncOperator, Operator } from './operator';

/**
 * Counts the big integer number of elements in a sequence.
 *
 * @example ```typescript
 * import { countBigInt } from '@fiorite/core/operators';
 * import { Readable } from 'stream';
 *
 * countBigInt()([1, 2, 3]); // 3
 * countBigInt(x => x === 2)([1, 2, 3]); // 1
 *
 * countBigInt()(Readable.from([1, 2, 3])); // [Promise [BigInt 3]]
 * countBigInt(x => x === 2)(Readable.from([1, 2, 3])); // [Promise [BigInt 1]]
 * ```
 *
 * @param predicate
 */
export function countBigInt<E>(predicate?: Predicate<[E]>): CombinedOperator<E, bigint, Promise<bigint>>;

/**
 * Counts the big integer number of elements in a sequence.
 *
 * @example ```typescript
 * import { countBigInt } from '@fiorite/core/operators';
 * import { Readable } from 'stream';
 *
 * countBigInt(async x => x === 2)(Readable.from([1, 2, 3])); // [Promise [BigInt 1]]
 * ```
 *
 * @param predicate
 */
export function countBigInt<E>(predicate: AsyncPredicate<[E]>): AsyncOperator<E, Promise<bigint>>;

/**
 * @inheritDoc
 */
export function countBigInt<E>(...args: any[]) {
  return combine(() => countBigIntSync(...args), () => countBigIntAsync(...args));
}

/**
 * Counts the big integer number of elements in a sequence.
 *
 * @example ```typescript
 * import { countBigIntSync } from '@fiorite/core/operators';
 *
 * const sequence = [1, 2, 3];
 *
 * countBigIntSync()(sequence); // [BigInt 3]
 * countBigIntSync(x => x === 2)(sequence); // [BigInt 1]
 * ```
 *
 * @param predicate
 */
export function countBigIntSync<E>(predicate: Predicate<[E]> = () => true): Operator<E, bigint> {
  return function (iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    let count = BigInt(0);
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
 * Counts the big integer number of elements in a sequence.
 *
 * @example ```typescript
 * import { countBigIntAsync } from '@fiorite/core/operators';
 * import { Readable } from 'stream';
 *
 * countBigIntAsync()(Readable.from([1, 2, 3])); // [Promise [BigInt 3]]
 * countBigIntAsync(x => x === 2)(Readable.from([1, 2, 3])); // [Promise [BigInt 1]]
 * countBigIntAsync(async x => x === 2)(Readable.from([1, 2, 3])); // [Promise [BigInt 1]]
 * ```
 *
 * @param predicate
 */
export function countBigIntAsync<E>(predicate: AnyPredicate<[E]> = () => true): AsyncOperator<E, Promise<bigint>> {
  return async function (iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);

    let count = BigInt(0);

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
