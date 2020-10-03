/**
 * Functional type that consumes specified argument and returns projection of it.
 *
 * @example ```typescript
 * import { Selector } from '@fiorite/core';
 *
 * const selector: Selector<number, string> => (object: number) => object.toString();
 * ```
 */
export type Selector<E, R = E> = (element: E) => R;

/**
 * Functional type that consumes specified argument and returns projection of it.
 *
 * @example ```typescript
 * import { Selector } from '@fiorite/core';
 *
 * const selector: Selector<number, string> => (object: number) => object.toString();
 * ```
 */
export type AsyncSelector<E, R = E> = (element: E) => Promise<R>;

/**
 * Functional type that consumes specified argument and returns projection of it.
 *
 * @example ```typescript
 * import { Selector } from '@fiorite/core';
 *
 * const selector: Selector<number, string> => (object: number) => object.toString();
 * ```
 */
export type AnySelector<E, R = E> = (element: E) => R | Promise<R>;
