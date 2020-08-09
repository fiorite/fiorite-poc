import { PromiseOr } from './promise-or';

/**
 * Action that performs on element and returns new result.
 */
export type Selector<E, R = E> = (element: E) => R;

/**
 * Action that performs on indexed element and returns new result.
 */
export type IndexedSelector<E, R = E> = (element: E, index: number) => R;

/**
 * Action that performs on element and returns new result.
 */
export type AsyncSelector<E, R = E> = (element: E) => PromiseOr<R>;

/**
 * Action that performs on indexed element and returns new result.
 */
export type IndexedAsyncSelector<E, R = E> = (element: E, index: number) => PromiseOr<R>;
