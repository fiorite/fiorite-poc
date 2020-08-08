import { PromiseOr } from './promise-or';

/**
 * Action that performs on indexed element and returns {@link Boolean} result.
 */
export type Predicate<E> = (element: E, index: number) => boolean;

/**
 * Action that performs on indexed element and returns {@link Boolean} result.
 */
export type AsyncPredicate<E> = (element: E, index: number) => PromiseOr<boolean>;
