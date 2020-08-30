import { Module } from '../module';
import { Injector } from '../di';

export interface Startup extends Module {
  // noinspection JSUnusedGlobalSymbols
  start(inject: Injector): void | Promise<void>;
}
