/**
 * Functional type that returns specified result.
 *
 * @example ```typescript
 * import { Getter } from '@fiorite/core';
 *
 * const getter: Getter<number> = () => 1;
 * ```
 */
export type Getter<R> = () => R;
