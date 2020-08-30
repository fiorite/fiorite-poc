import { ProviderCollection, Injector } from '@fiorite/core/extension_api';

import { NotImplementedError } from '../errors';
import { Logger } from './logger';
import defineProperty = Reflect.defineProperty;

declare module '@fiorite/core/extension_api' {
  interface ProviderCollection {
    addLogger(): this;
  }
}

ProviderCollection.prototype.addLogger = function(this: ProviderCollection) {
  throw new NotImplementedError();
}

declare module '@fiorite/core/extension_api' {
  interface Injector {
    readonly logger: Logger;

    getLogger(): Logger;
  }
}

defineProperty(Injector.prototype, 'logger', {
  get(this: Injector) {
    return this.getLogger();
  }
})

Injector.prototype.getLogger = function(this: Injector) {
  return this.get(Logger);
}

