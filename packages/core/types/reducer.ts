export type Reducer<T, R = T, A extends unknown[] = []> = (current: R, next: T, ...rest: A) => R;
export type AsyncReducer<T, R = T, A extends unknown[] = []> = (current: R, next: T, ...rest: A) => Promise<R>;
export type AnyReducer<T, R = T, A extends unknown[] = []> = Reducer<T, R, A> | AsyncReducer<T, R, A>;
