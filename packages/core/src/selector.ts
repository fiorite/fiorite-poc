import { PromiseOr } from './promise-or';

/**
 * Action that performs on indexed element and returns new result.
 */
export type Selector<E, R> = (element: E, index: number) => R;

/**
 * Action that performs on indexed element and returns new result.
 */
export type AsyncSelector<E, R> = (element: E, index: number) => PromiseOr<R>;
