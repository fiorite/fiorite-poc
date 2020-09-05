/**
 * @example ```typescript
 * import { clone, Cloneable } from '@fiorite/core';
 *
 * class Person implements Cloneable<Person> {
 *   [Symbol.clone](): Person {
 *     return new Person();
 *   }
 * }
 *
 * const person1 = new Person();
 * const person2 = clone(person1);
 *
 * person1 === person2; // false
 * ```
 */
export interface Cloneable<T = unknown> {
  [Symbol.clone](): T;
}
