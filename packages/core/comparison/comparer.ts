/**
 * Defines a method that a type implements to compare two objects.
 */
export type Comparer<T = unknown> = (x: T, y: T) => number;
