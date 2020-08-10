import { PromiseOr } from './promise-or';

/**
 * Action that performs on element and returns {@link Boolean} result.
 */
export type Predicate<E, A extends unknown[] = never[]> = (element: E, ...args: A) => boolean;

/**
 * Action that performs on element and returns {@link Boolean} result.
 */
export type AsyncPredicate<E, A extends unknown[] = never[]> = (element: E, ...args: A) => PromiseOr<boolean>;
