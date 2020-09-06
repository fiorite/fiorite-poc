import { AnyCallback } from '../types';
import { Listener } from '../listening';
import { combine, CombinedOperator } from './combine';

export function listen<E>(callback: AnyCallback<[E]> = () => { }, sync = false): CombinedOperator<E, Listener, Listener> {
  return combine(() => listenSync(callback, sync), () => listenAsync(callback, sync));
}

export function listenSync<E>(callback: AnyCallback<[E]> = () => { }, sync = false) {
  return function (iterable: Iterable<E>): Listener {
    const listener = new Listener();

    if (!sync) {
      callback = (element: E) => {
        callback(element);
      };
    }

    (async () => {
      const iterator = iterable[Symbol.iterator]();

      let result = iterator.next();

      while (!result.done) {
        if (listener.closed) {
          if (iterator.return) {
            iterator.return();
          }

          break;
        }

        await callback(result.value);

        result = iterator.next();
      }

      if (!listener.closed) {
        listener.close();
      }
    })();

    return listener;
  };
}

/**
 * TODO: Add sync strategy.
 * @param callback
 */
export function listenAsync<E>(callback: AnyCallback<[E]> = () => { }, sync = false) {
  return function (iterable: AsyncIterable<E>): Listener {
    const listener = new Listener();

    if (!sync) {
      callback = (element: E) => {
        callback(element);
      };
    }

    (async () => {
      const iterator = iterable[Symbol.asyncIterator]();
      let result = await iterator.next();

      while (!result.done) {
        if (listener.closed) {
          if (iterator.return) {
            await iterator.return();
          }

          break;
        }

        await callback(result.value);

        result = await iterator.next();
      }

      if (!listener.closed) {
        await listener.close();
      }
    })();

    return listener;
  };
}
