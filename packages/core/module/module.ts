import type { Type } from '../types';
import type { ProviderCollection, ProviderTuple } from '../di';

export interface Module {
  providers?: (Type | object | ProviderTuple)[];
  dependencies?: Type<Module>[];
  configure?(providers: ProviderCollection): void | Promise<void>;
}
