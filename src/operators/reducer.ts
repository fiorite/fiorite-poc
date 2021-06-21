export type Reducer<E, R = E, P extends unknown[] = []> = (current: R, next: E, ...args: P) => R;
