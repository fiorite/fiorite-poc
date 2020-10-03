import { expect } from 'chai';

import { createAsyncIterable, listen, listenAsync, pipe, pipeAsync, sequenceEqual } from '@fiorite/core/operators';

describe('listen() / listenAsync()', () => {
  const sequence = [1, 2, 3];

  function getTime() {
    return new Date().getTime()
  }

  describe('listen()', () => {
    it('should run without sync', async () => {
      const buffer: number[] = [];
      const start = getTime();
      let duration = 10;

      const listener = pipe(
        listen<number>(async element => {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve();
              buffer.push(element);
            }, duration);

            duration -= 5;
          });
        }),
      )(sequence);

      await listener.closes;

      expect(getTime() - start < 10).equals(true);

      setTimeout(() => {
        expect(
          sequenceEqual(buffer)([3, 2, 1]),
        ).equals(true);
      }, 10);
    });

    it('should run with sync', async () => {
      const buffer: number[] = [];
      const start = getTime();
      let duration = 10;

      const listener = pipe(
        listen<number>(async element => {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve();
              buffer.push(element);
            }, duration);

            duration -= 5;
          });
        }, true),
      )(sequence);

      await listener.closes;

      expect(getTime() - start > 10).equals(true);

      setTimeout(() => {
        expect(
          sequenceEqual(buffer)([1, 2, 3]),
        ).equals(true);
      }, 20);
    });
  });

  describe('listenAsync()', () => {
    it('should run without sync', async () => {
      const buffer: number[] = [];
      const start = getTime();
      let duration = 10;

      const listener = pipeAsync(
        listenAsync<number>(async element => {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve();
              buffer.push(element);
            }, duration);

            duration -= 5;
          });
        }),
      )(createAsyncIterable(sequence));

      await listener.closes;

      expect(getTime() - start < 10).equals(true);

      setTimeout(() => {
        expect(
          sequenceEqual(buffer)([3, 2, 1]),
        ).equals(true);
      }, 10);
    });

    it('should run with sync', async () => {
      const buffer: number[] = [];
      const start = getTime();
      let duration = 10;

      const listener = pipeAsync(
        listenAsync<number>(async element => {
          return new Promise(resolve => {
            setTimeout(() => {
              resolve();
              buffer.push(element);
            }, duration);

            duration -= 5;
          });
        }, true),
      )(createAsyncIterable(sequence));

      await listener.closes;

      expect(getTime() - start > 10).equals(true);

      setTimeout(() => {
        expect(
          sequenceEqual(buffer)([1, 2, 3]),
        ).equals(true);
      }, 20);
    });
  });
});
