export type Reducer<E, R = E, P extends unknown[] = []> = (current: R, next: E, ...args: P) => R;
export type AsyncReducer<E, R = E, P extends unknown[] = []> = (current: R, next: E, ...args: P) => Promise<R>;
export type AnyReducer<E, R = E, P extends unknown[] = []> = Reducer<E, R, P> | AsyncReducer<E, R, P>;
