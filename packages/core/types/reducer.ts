export type Reducer<T, R = T, P extends unknown[] = []> = (result: R, object: T, ...args: P) => R;
export type AsyncReducer<T, R = T, P extends unknown[] = []> = (result: R, object: T, ...args: P) => Promise<R>;
export type AnyReducer<T, R = T, P extends unknown[] = []> = Reducer<T, R, P> | AsyncReducer<T, R, P>;
