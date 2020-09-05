import { AnyIterable, AnySelector, AsyncSelector, Selector, Type } from '../types';
import { AsyncOperator, Operator } from './operator';
import { combine, CombinedOperator } from './combine';
import { flatAsync, flatSync } from './flat';

export function catchError<E>(selector: Selector<Error, E>): CombinedOperator<E, Iterable<E>, AsyncIterable<E>>;
export function catchError<E>(selector: AsyncSelector<Error, E>): AsyncOperator<E, AsyncIterable<E>>;
export function catchError<E, R extends Error>(errorType: Type<R>, selector: Selector<R, E>): CombinedOperator<E, Iterable<E>, AsyncIterable<E>>;
export function catchError<E, R extends Error>(errorType: Type<R>, selector: AsyncSelector<Error, E>): AsyncOperator<E, AsyncIterable<E>>;
export function catchError(...args: any): any {
  return combine(() => (catchErrorSync as any)(...args), () => (catchErrorAsync as any)(...args));
}


export function catchErrorSync<E>(selector: Selector<Error, E | Iterable<E>>): Operator<E, Iterable<E>>;
export function catchErrorSync<E, R extends Error>(errorType: Type<R>, selector: Selector<R, E | Iterable<E>>): Operator<E, Iterable<E>>;
export function catchErrorSync<E>(...args: any[]) {
  let selector: Selector<Error, E | Iterable<E>>;

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

  return function *(iterable: Iterable<E>) {
    const iterator = iterable[Symbol.iterator]();

    try {
      let result = iterator.next();

      while (!result!.done) {
        yield result.value;

        try {
          result = iterator.next();
        } catch(error) {
          yield *flatSync()([selector(error)]);
        }
      }

    } catch(error) {
      yield *flatSync()([selector(error)]);
    }
  };
}

export function catchErrorAsync<E>(selector: AnySelector<Error, E | AnyIterable<E>>): AsyncOperator<E, AsyncIterable<E>>;

export function catchErrorAsync<E, R extends Error>(errorType: Type<R>, selector: AnySelector<R, E | AnyIterable<E>>): AsyncOperator<E, AsyncIterable<E>>;

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
