import { Operator } from './operator';

export function concat<E>(...iterables: Iterable<E>[]): Operator<E> {
  return function*(iterable: Iterable<E>) {
    for (const x of [iterable, ...iterables]) {
      yield* x;
    }
  };
}
