import { collect } from '../packages/core/src/collections';

/**
 * TODO: Implement Application/Module interfaces.
 */

(async () => {
  function throwError() {
    throw new TypeError();
  }

  // Catch any error
  collect([1])
    .tap(throwError)
    .catchError(error => -1)
    .toArray(); // [-1]

  // Catch specific error
  collect([1])
    .tap(throwError)
    .catchError(TypeError, () => -1)
    .toArray(); // [-1]

  // Catch specific error
  collect([1])
    .tap(throwError)
    .catchError(RangeError, () => -1)
    .toArray(); // throws TypeError

  // const server = httpServer(5000);
  //
  // for await (const { response } of server) {
  //   response.end('Hello world!');
  // }
})();
