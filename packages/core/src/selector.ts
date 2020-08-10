import { PromiseOr } from './promise-or';

/**
 * Action that performs on element and returns new result.
 */
export type Selector<E, R = E, A extends unknown[] = never[]> = (element: E, ...args: A) => R;

/**
 * Action that performs on element and returns new result.
 */
export type AsyncSelector<E, R = E, A extends unknown[] = never[]> = (element: E, ...args: A) => PromiseOr<R>;

