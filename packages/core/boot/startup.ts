import type { Module } from '../types';
import type { Injector } from '../di';

export interface Startup extends Module {
  // noinspection JSUnusedGlobalSymbols
  start(inject: Injector): void | Promise<void>;
}
