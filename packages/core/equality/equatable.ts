/**
 * Behavioral interface to control equal comparison between current and another object.
 *
 * @example ```typescript
 * import { equals, Equatable } from '@fiorite/core';
 *
 * class Person implements Equatable {
 *   constructor(readonly name: string) { }
 *
 *   [Symbol.equals](other: unknown): boolean {
 *     return other instanceof Person &&
 *       other.name === this.name;
 *   }
 * }
 *
 * class person1 = new Person('John');
 * class person2 = new Person('Dave');
 * class person3 = new Person('Dave');
 *
 * equals(person1, person2); // false
 * equals(person2, person3); // true
 * ```
 */
export interface Equatable {
  /**
   * Compares whether another object is the same as current.
   */
  [Symbol.equals](other: unknown): boolean;
}
