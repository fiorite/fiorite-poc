import { AsyncOperator, AsyncPredicate, Operator, Predicate } from '../common';
import { combine, CombinedOperator } from './combine';

/**
 * Returns a combined operator that determines whether any element of a sequence satisfies a condition.
 *
 * @example```typescript
 * import { some } from '@fiorite/core/operators';
 * import { Readable } from 'stream';
 *
 * const operator1 = some();
 *
 * operator1([]); // false
 * operator1(Readable.from([])); // [Promise false]
 *
 * operator1([1, 2, 3]); // true
 * operator1(Readable.from([1, 2, 3])); // [Promise true]
 *
 * const operator2 = some(x => x === 2);
 *
 * operator2([1, 3]); // false
 * operator2(Readable.from([1, 3])); // [Promise false]
 *
 * operator2([1, 2, 3]); // true
 * operator2(Readable.from([1, 2, 3])); // [Promise true]
 * ```
 *
 * @param predicate default = () => true.
 */
export function some<E>(predicate?: Predicate<E, [number]>): CombinedOperator<E, boolean, Promise<boolean>>;

/**
 * Returns a combined operator that determines whether any element of an async sequence satisfies a condition.
 *
 * @example```typescript
 * import { some } from '@fiorite/core/operators';
 * import { Readable } from 'stream';
 *
 * const operator = some(x => Promise.resolve(x === 2));
 * operator(Readable.from([1, 2, 3])); // [Promise true]
 * ```
 *
 * @param predicate
 */
export function some<E>(predicate: AsyncPredicate<E, [number]>): AsyncOperator<E, Promise<boolean>>;

/**
 * @inheritDoc
 */
export function some<E>(...args: any[]) {
  return combine(() => someSync<E>(...args), () => someAsync<E>(...args));
}

/**
 * Returns an operator that determines whether any element of a sequence satisfies a condition.
 *
 * @example```typescript
 * import { someSync } from '@fiorite/core/operators';
 *
 * const operator1 = someSync();
 *
 * operator1([]); // false
 * operator1([1, 2, 3]); // true
 *
 * const operator2 = someSync(x => x === 2);
 *
 * operator2([1, 3]); // false
 * operator2([1, 2, 3]); // true
 * ```
 *
 * @param predicate default = () => true.
 */
export function someSync<E>(predicate: Predicate<E, [number]> = () => true): Operator<E, boolean> {
  return function (iterable: Iterable<E>) {
    if (Array.isArray(iterable)) {
      return iterable.some(predicate);
    }

    const iterator = iterable[Symbol.iterator]();

    let result = iterator.next();

    if (predicate.length < 2) {
      while (!result.done) {
        if ((predicate as Predicate<E>)(result.value)) {
          if (iterator.return) {
            iterator.return();
          }

          return true;
        }

        result = iterator.next();
      }
    } else {
      let index = 0;

      while (!result.done) {
        if (predicate(result.value, index)) {
          if (iterator.return) {
            iterator.return();
          }

          return true;
        }

        result = iterator.next();
        index++;
      }
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
export function someAsync<E>(predicate: Predicate<E, [number]> | AsyncPredicate<E, [number]> = () => true): AsyncOperator<E, Promise<boolean>> {
  return async function (iterable: AsyncIterable<E>) {
    const iterator = iterable[Symbol.asyncIterator]();

    let result = await iterator.next();
    let index = 0;

    while (!result.done) {
      if (await predicate(result.value, index)) {
        if (iterator.return) {
          await iterator.return();
        }

        return true;
      }

      result = await iterator.next();
      index++;
    }

    return false;
  };
}
