import { Injector } from './injector';

export type Provide<T = unknown> = (injector: Injector) => T;
