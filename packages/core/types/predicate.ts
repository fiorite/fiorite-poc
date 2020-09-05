/**
 * Functional type that consumes specified arguments and returns {@link Boolean}.
 */
export type Predicate<T extends unknown[] = []> = (...args: T) => boolean;

/**
 * Functional type that consumes specified arguments and returns {@link Promise} of {@link Boolean}.
 */
export type AsyncPredicate<T extends unknown[] = []> = (...args: T) => Promise<boolean>;

/**
 * Functional type that consumes specified arguments and returns {@link Boolean} or {@link Promise} of it.
 */
export type AnyPredicate<T extends unknown[] = []> = Predicate<T> | AsyncPredicate<T>;
