import { Injector } from './injector';

/**
 * Creates instance of particular service.
 */
export type ServiceFactory<T = unknown> = (injector: Injector) => T;
