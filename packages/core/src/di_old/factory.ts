import { Injector } from './injector';

export type InjectionFactory<T = unknown> = (injector: Injector) => T;
