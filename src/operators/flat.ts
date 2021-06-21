import { Operator } from './operator';
import { getIterator, isIterable } from '../iteration';

export function flat<E>(): Operator<E, Iterable<E extends Iterable<infer P> ? P : E>> {
  return function* (iterable: Iterable<E>) {
    const iterator = getIterator(iterable);

    let result = iterator.next();

    while (!result.done) {
      const element = result.value;

      if (isIterable(element)) {
        yield* element as any;
        const iterator2 = getIterator(element as any);
        let result2 = iterator2.next();

        while (!result2.done) {
          yield result2.value as any;
          result2 = iterator2.next()
        }
      } else {
        yield result.value as any;
      }

      result = iterator.next();
    }
  };
}
