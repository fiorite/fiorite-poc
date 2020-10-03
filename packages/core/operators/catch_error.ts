import { Type } from '../functional_types';
import { AnyIterable, AnySelector, AsyncOperator, Operator, Selector } from './functional_types';
import { isClass } from '../utilities';

function resolveSelector(...args: any[]) {
  if (args.length === 0) {
    return () => [];
  } else if (args.length === 1) {
    if (isClass(args[0])) {
      return (error: Error) => {
        if (error instanceof args[0]) {
          return [];
        }

        throw error;
      };
    } else {
      return args[0];
    }
  } else if (args.length === 2) {
    return (error: Error) => {
      if (error instanceof args[0]) {
        return args[1](error);
      }

      throw error;
    }
  } else {
    throw new Error();
  }
}

export function catchError<E>(selector?: Selector<Error, Iterable<E>>): Operator<E, Iterable<E>>;
export function catchError<E, TError = Error>(errorType: Type<TError>, selector?: Selector<TError, Iterable<E>>): Operator<E, Iterable<E>>;
export function catchError<E>(...args: any[]) {
  let selector: Selector<Error, Iterable<E>> = resolveSelector(...args);

  return function *(iterable: Iterable<E>) {
    const iterator = iterable[Symbol.iterator]();

    try {
      let result = iterator.next();

      while (!result!.done) {
        yield result.value;

        try {
          result = iterator.next();
        } catch(error) {
          yield* selector(error);
          break; // todo: check whether its needed
        }
      }

    } catch(error) {
      yield* selector(error);
    }
  };
}

export function catchErrorAsync<E>(selector?: AnySelector<Error, AnyIterable<E>>): AsyncOperator<E, AsyncIterable<E>>;

export function catchErrorAsync<E, R extends Error>(errorType: Type<R>, selector?: AnySelector<R, AnyIterable<E>>): AsyncOperator<E, AsyncIterable<E>>;

export function catchErrorAsync<E>(...args: any[]) {
  let selector: Selector<Error, Iterable<E>> = resolveSelector(...args);

  return async function *(iterable: AsyncIterable<E>) {
    const iterator = iterable[Symbol.asyncIterator]();

    try {
      let result = await iterator.next();

      while (!result!.done) {
        yield result.value;

        try {
          result = await iterator.next();
        } catch (error) {
          yield* await selector(error);
          break; // todo: check whether its needed
        }
      }

    } catch (error) {
      yield* await selector(error);
    }
  };
}
