import { collect } from '@fiorite/core';
import {
  append,
  appendAsync,
  appendSync,
  pipe,
  sequenceEqual,
  sequenceEqualAsync,
  sequenceEqualSync,
  toAsync
} from '@fiorite/core/operators';

(async () => {
  // #1. Sync collection

  collect([1, 2, 3])
    .append(4)
    .sequenceEqual([1, 2, 3, 4]); // true

  // #2. Async collection

  await collect([1, 2, 3])
    .toAsync()
    .append(4)
    .sequenceEqual([1, 2, 3, 4]); // [Promise true]

  // #3.1. Sync pipeline

  pipe(
    append(4),
    sequenceEqual([1, 2, 3, 4]),
  )([1, 2, 3]); // true

  // #3.2. True sync pipeline

  pipe(
    appendSync(4),
    sequenceEqualSync([1, 2, 3, 4]),
  )([1, 2, 3]); // true

  // #4.1. Async pipeline

  await pipe(
    toAsync<number>(),
    append(4),
    sequenceEqual([1, 2, 3, 4]),
  )([1, 2, 3]); // [Promise true]

  // #4.2. True async pipeline

  await pipe(
    toAsync<number>(),
    appendAsync(4),
    sequenceEqualAsync([1, 2, 3, 4]),
  )([1, 2, 3]); // [Promise true]

  // #5.1. Sync operation

  sequenceEqual([1, 2, 3, 4])(
    append(4)(([1, 2, 3])),
  ); // true

  // #5.2. True sync operation

  sequenceEqualSync([1, 2, 3, 4])(
    appendSync(4)(([1, 2, 3])),
  ); // true

  // #6.1. Async operation

  await sequenceEqual([1, 2, 3, 4])(
    append(4)(
      toAsync<number>()([1, 2, 3])
    ),
  ); // [Promise true]

  // #6.2. True async operation

  await sequenceEqualAsync([1, 2, 3, 4])(
    appendAsync(4)(
      toAsync<number>()([1, 2, 3])
    ),
  ); // [Promise true]

})();
//
// (async () => {
//   const subject = new CollectionSubject<number>(); // [Collection [1, 2, 3]]
//
//   const listener = process(subject);
//
//   await subject.addAll([1, 2, 3]).close();
//
//   listener.close();
//
//   const operator = tap(() => void 0);
//
//   function process<E>(source: Collection<E> | AsyncCollection<E>): Listener {
//     return source
//       .reverse()
//       .tap((x) => console.log(x))
//       .listen();
//   }
// })();
