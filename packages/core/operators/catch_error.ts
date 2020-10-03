import { Type } from '../functional_types';
import { AnyIterable, AnySelector, AsyncOperator, Operator, Selector } from './functional_types';
import { flat, flatAsync } from './flat';
import { isClass } from '../util';

export function catchError<E>(selector?: Selector<Error, E | Iterable<E>>): Operator<E, Iterable<E>>;
export function catchError<E, TError = Error>(errorType: Type<TError>, selector?: Selector<TError, E | Iterable<E>>): Operator<E, Iterable<E>>;
export function catchError<E>(...args: any[]) {
  let selector: Selector<Error, E | Iterable<E>>;

  if (args.length === 0) {
    selector = () => [];
  } else if (args.length === 1) {
    if (isClass(args[0])) {
      selector = error => {
        if (error instanceof args[0]) {
          return [];
        }

        throw error;
      };
    } else {
      selector = args[0];
    }
  } else if (args.length === 2) {
    selector = error => {
      if (error instanceof args[0]) {
        return args[1](error);
      }

      throw error;
    }
  } else {
    throw new Error();
  }

  return function *(iterable: Iterable<E>) {
    const iterator = iterable[Symbol.iterator]();

    try {
      let result = iterator.next();

      while (!result!.done) {
        yield result.value;

        try {
          result = iterator.next();
        } catch(error) {
          yield *flat()([selector(error)]);
        }
      }

    } catch(error) {
      yield *flat()([selector(error)]);
    }
  };
}

export function catchErrorAsync<E>(selector?: AnySelector<Error, E | AnyIterable<E>>): AsyncOperator<E, AsyncIterable<E>>;

export function catchErrorAsync<E, R extends Error>(errorType: Type<R>, selector?: AnySelector<R, E | AnyIterable<E>>): AsyncOperator<E, AsyncIterable<E>>;

export function catchErrorAsync<E>(...args: any[]) {
  let selector: AnySelector<Error, E | AnyIterable<E>>;

  if (args.length === 1) {
    selector = args[0];
  } else if (args.length === 2) {
    selector = error => {
      if (error instanceof args[0]) {
        return args[1](error);
      }

      throw error;
    }
  } else {
    throw new Error();
  }

  return async function *(iterable: AsyncIterable<E>) {
    const iterator = iterable[Symbol.asyncIterator]();

    try {
      let result = await iterator.next();

      while (!result!.done) {
        yield result.value;

        try {
          result = await iterator.next();
        } catch(error) {
          yield *flatAsync()([await selector(error)]);
        }
      }

    } catch(error) {
      yield *flatAsync()([await selector(error)]);
    }
  };
}
