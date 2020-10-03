import { AnyPredicate, AsyncOperator, Operator, Predicate } from './functional_types';
import { getAsyncIterator, getIterator } from './utilities';

/**
 * Returns an operator that determines whether any element of a sequence satisfies a condition.
 *
 * @example```typescript
 * import { some } from '@fiorite/core/operators';
 *
 * const operator1 = some();
 *
 * operator1([]); // false
 * operator1([1, 2, 3]); // true
 *
 * const operator2 = some(x => x === 2);
 *
 * operator2([1, 3]); // false
 * operator2([1, 2, 3]); // true
 * ```
 *
 * @param predicate default = () => true.
 */
export function some<E>(predicate: Predicate<E> = () => true): Operator<E, boolean> {
  return function (iterable: Iterable<E>) {
    if (Array.isArray(iterable)) {
      return iterable.some(predicate);
    }

    const iterator = getIterator(iterable);

    let result = iterator.next();

    while (!result.done) {
      if (predicate(result.value)) {
        if (iterator.return) {
          iterator.return();
        }

        return true;
      }

      result = iterator.next();
    }

    return false;
  };
}

/**
 * Returns an operator that determines whether any element of an async sequence satisfies a condition.
 *
 * @example```typescript
 * import { someAsync } from '@fiorite/core/operators';
 * import { Readable } from 'stream';
 *
 * const operator1 = someAsync();
 *
 * operator1(Readable.from([])); // [Promise false]
 * operator1(Readable.from([1, 2, 3])); // [Promise true]
 *
 * const operator2 = someAsync(x => Promise.resolve(x === 2));
 *
 * operator2(Readable.from([1, 3])); // [Promise false]
 * operator2(Readable.from([1, 2, 3])); // [Promise true]
 * ```
 *
 * @param predicate default = () => true.
 */
export function someAsync<E>(predicate: AnyPredicate<E> = () => true): AsyncOperator<E, Promise<boolean>> {
  return async function (iterable: AsyncIterable<E>) {
    const iterator = getAsyncIterator(iterable);

    let result = await iterator.next();

    while (!result.done) {
      if (await predicate(result.value)) {
        if (iterator.return) {
          await iterator.return();
        }

        return true;
      }

      result = await iterator.next();
    }

    return false;
  };
}
