import { Injector, ProviderCollection } from '@fiorite/core/injector';

import { NotImplementedError } from '../errors';
import { Logger } from './logger';

declare module '@fiorite/core/injector' {
  interface ProviderCollection {
    addLogger(): this;
  }
}

ProviderCollection.prototype.addLogger = function(this: ProviderCollection) {
  throw new NotImplementedError();
}

declare module '@fiorite/core/injector' {
  interface Injector {
    readonly logger: Logger;

    getLogger(): Logger;
  }
}

Object.defineProperty(Injector.prototype, 'logger', {
  get(this: Injector) {
    return this.getLogger();
  }
})

Injector.prototype.getLogger = function(this: Injector) {
  return this.get(Logger);
}

