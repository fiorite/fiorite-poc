/**
 * Functional type that consumes specified arguments and returns no result.
 *
 * @example ```typescript
 * const callback: Callback<string> = (word: string) => { };
 * ```
 */
export type Callback<P extends unknown[] = []> = (...args: P) => void;

/**
 * Functional type that consumes specified arguments and returns no result.
 *
 * @example ```typescript
 * const callback: Callback<string> = (word: string) => { };
 * ```
 */
export type AsyncCallback<P extends unknown[] = []> = (...args: P) => Promise<void>;

/**
 * Functional type that consumes specified arguments and returns no result.
 *
 * @example ```typescript
 * const callback: Callback<string> = (word: string) => { };
 * ```
 */
export type AnyCallback<P extends unknown[] = []> = (...args: P) => unknown | Promise<unknown>;
