import { AnyCallback } from '../functional_types';
import { Listener } from '../listening';

export function listen<E>(callback: AnyCallback<[E]> = () => { }, sync = false) {
  return function (iterable: Iterable<E>): Listener {
    const listener = new Listener();

    if (!sync) {
      const scoped = callback;

      callback = (element: E) => {
        scoped(element);
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

export function listenAsync<E>(callback: AnyCallback<[E]> = () => { }, sync = false) {
  return function (iterable: AsyncIterable<E>): Listener {
    const listener = new Listener();

    if (!sync) {
      const scoped = callback;

      callback = (element: E) => {
        scoped(element);
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
