/**
 * Action that performs on element and returns new result.
 */
export type Selector<T, R = T, A extends unknown[] = []> = (element: T, ...args: A) => R;

/**
 * Action that performs on element and returns new result.
 */
export type AsyncSelector<T, R = T, A extends unknown[] = []> = (element: T, ...args: A) => Promise<R>;


export type AnySelector<T, R = T, A extends unknown[] = []> = Selector<T, R, A> | AsyncSelector<T, R, A>;
