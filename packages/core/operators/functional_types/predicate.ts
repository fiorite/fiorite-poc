/**
 * Functional type that consumes specified arguments and returns {@link Boolean} result.
 *
 * @example ```typescript
 * const predicate: Predicate<number> = (element: number) => index % 2 === 0;
 * ```
 */
export type Predicate<E> = (element: E) => boolean;

/**
 * Functional type that consumes specified arguments and returns {@link Boolean} result.
 *
 * @example ```typescript
 * const predicate: Predicate<number> = (element: number) => index % 2 === 0;
 * ```
 */
export type AsyncPredicate<E> = (element: E) => Promise<boolean>;

/**
 * Functional type that consumes specified arguments and returns {@link Boolean} result.
 *
 * @example ```typescript
 * const predicate: Predicate<number> = (element: number) => index % 2 === 0;
 * ```
 */
export type AnyPredicate<E> = (element: E) => boolean | Promise<boolean>;
