import type { Module } from '../functional_types';
import type { Injector } from '../di';

export interface Startup extends Module {
  // noinspection JSUnusedGlobalSymbols
  start(inject: Injector): void | Promise<void>;
}
