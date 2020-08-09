import { PromiseOr } from './promise-or';

/**
 * Action that performs on element and returns {@link Boolean} result.
 */
export type Predicate<E> = (element: E) => boolean;

/**
 * Action that performs on indexed element and returns {@link Boolean} result.
 */
export type IndexedPredicate<E> = (element: E, index: number) => boolean;

/**
 * Action that performs on element and returns {@link Boolean} result.
 */
export type AsyncPredicate<E> = (element: E, index: number) => PromiseOr<boolean>;

/**
 * Action that performs on indexed element and returns {@link Boolean} result.
 */
export type IndexedAsyncPredicate<E> = (element: E, index: number) => PromiseOr<boolean>;
