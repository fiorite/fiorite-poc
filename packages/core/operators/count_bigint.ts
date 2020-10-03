import { AnyPredicate, AsyncOperator, Operator, Predicate } from './functional_types';
import { getAsyncIterator, getIterator } from './utilities';

/**
 * Counts the big integer number of elements in a sequence.
 *
 * @example ```typescript
 * import { countBigInt } from '@fiorite/core/operators';
 *
 * const sequence = [1, 2, 3];
 *
 * countBigIntSync()(sequence); // [BigInt 3]
 * countBigIntSync(x => x === 2)(sequence); // [BigInt 1]
 * ```
 *
 * @param predicate
 *
 * @deprecated postpone for the future
 */
export function countBigInt<E>(predicate: Predicate<E> = () => true): Operator<E, bigint> {
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
 *
 * @deprecated postpone for the future
 */
export function countBigIntAsync<E>(predicate: AnyPredicate<E> = () => true): AsyncOperator<E, Promise<bigint>> {
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
