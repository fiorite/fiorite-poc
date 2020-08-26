import { AsyncCallback, Callback } from '../common';
import { Listener } from '../listener';
import { combine, CombinedOperator } from './combine';

export function listen<E>(callback: Callback<E, [number]> | AsyncCallback<E, [number]> = () => { }): CombinedOperator<E, Listener, Listener> {
  return combine(() => listenSync(callback), () => listenAsync(callback));
}

export function listenSync<E>(callback: Callback<E, [number]> | AsyncCallback<E, [number]> = () => { }) {
  return function (iterable: Iterable<E>): Listener {
    const listener = new Listener();

    (() => {
      const iterator = iterable[Symbol.iterator]();

      let result = iterator.next();

      if (callback.length < 2) {
        while (!result.done) {
          if (listener.closed) {
            if (iterator.return) {
              iterator.return();
            }

            break;
          }

          (callback as Callback<E>)(result.value);

          result = iterator.next();
        }
      } else {
        let index = 0;

        while (!result.done) {
          if (listener.closed) {
            if (iterator.return) {
              iterator.return();
            }

            break;
          }

          callback(result.value, index);

          result = iterator.next();
          index++;
        }
      }

      if (!listener.closed) {
        listener.close();
      }
    })();

    return listener;
  };
}

export function listenAsync<E>(callback: Callback<E, [number]> | AsyncCallback<E, [number]> = () => { }) {
  return function (iterable: AsyncIterable<E>): Listener {
    const listener = new Listener();

    (async () => {
      const iterator = iterable[Symbol.asyncIterator]();
      let result = await iterator.next();

      if (callback.length < 2) {
        while (!result.done) {
          if (listener.closed) {
            if (iterator.return) {
              await iterator.return();
            }

            break;
          }

          (callback as AsyncCallback<E>)(result.value);

          result = await iterator.next();
        }
      } else {
        let index = 0;

        while (!result.done) {
          if (listener.closed) {
            if (iterator.return) {
              await iterator.return();
            }

            break;
          }

          callback(result.value, index);

          result = await iterator.next();
          index++;
        }
      }

      if (!listener.closed) {
        await listener.close();
      }
    })();

    return listener;
  };
}
