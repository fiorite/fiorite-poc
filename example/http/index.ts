import { collect } from '@fiorite/core';
import { tap } from '@fiorite/core/operators';

(async () => {
  const array = [1, 2, 3];

  const collection = collect(array).concat([2,3 ]); // [Collection [1, 2, 3]]

  collection.tap((x) => console.log(x)); // Run tap on collection

  tap(array, (x) => console.log(x)); // Run tap on array.

  tap(collection, (x) => console.log(x)); // Run tap on collection.

  const operator = tap(x => console.log(x)); // Create operator.

  operator(array); // Run tap on collection

  collection.pipe(operator); // Run tap on collection.

  operator(collection); // Run tap on collection
})();
