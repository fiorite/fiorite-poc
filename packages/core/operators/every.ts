import { AnyPredicate, AsyncOperator, Operator, Predicate } from './functional_types';
import { getAsyncIterator, getIterator } from './utilities';

/**
 * Determines whether all elements of a sequence satisfy a condition.
 *
 * @example ```typescript
 * import { every } from '@fiorite/core/operators';
 *
 * everySync(() => false)([]); // true
 * everySync(() => true)([1, 2, 3]); // true
 * everySync(x => x === 2)([1, 2, 3]); // false
 * ```
 *
 * @param predicate
 */
export function every<E>(predicate: Predicate<E>): Operator<E, boolean> {
  return function(iterable: Iterable<E>): boolean {
    if (Array.isArray(iterable)) { // Array optimization.
      return iterable.every(predicate);
    }

    const iterator = getIterator(iterable);

    let result = iterator.next();

    while (!result.done) {
      if (!predicate(result.value)) {
        if (iterator.return) {
          iterator.return();
        }

        return false;
      }

      result = iterator.next();
    }

    return true;
  };
}

/**
 * Determines whether all elements of a sequence satisfy a condition.
 *
 * @example ```typescript
 * import { everyAsync } from '@fiorite/core/operators';
 * import { Readable } from 'stream';
 *
 * every(() => false)(Readable.from([])); // [Promise true]
 * every(() => true)(Readable.from([1, 2, 3])); // [Promise true]
 * every(x => x === 2)(Readable.from([1, 2, 3])); // [Promise false]
 * every(async () => true)(Readable.from([1, 2, 3])); // [Promise true]
 * every(async x => x === 2)(Readable.from([1, 2, 3])); // [Promise false]
 * ```
 *
 * @param predicate
 */
export function everyAsync<E>(predicate: AnyPredicate<E>): AsyncOperator<E, Promise<boolean>> {
  return async function(iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);

    let result = await iterator.next();

    while (!result.done) {
      if (!await predicate(result.value)) {
        if (iterator.return) {
          await iterator.return();
        }

        return false;
      }

      result = await iterator.next();
    }

    return true;
  };
}
