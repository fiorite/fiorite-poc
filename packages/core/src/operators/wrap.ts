import { Operator } from '../common';

// TODO: Think whether it's right to have such operator. Then main idea to wrap generators.
export function wrap<E, R>(generator: Operator<E, Generator<R>>): Operator<E, Iterable<R>> {
  return function (iterable) {
    return {
      [Symbol.iterator]() {
        return generator(iterable);
      }
    }
  }
}
