import { AsyncCollection, collect, Collection, CollectionSubject, Listener } from '@fiorite/core';
import { append, some, tap, toArray } from '@fiorite/core/operators';

(async () => {

  const numbers = collect([1, 2, 3]);

  console.log(numbers.some(x => x > 2));

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
