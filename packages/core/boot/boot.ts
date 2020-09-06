import { Type } from '../types';
import { isClass, isFunction, PromiseOr } from '../util';
import { Injector, ProviderCollection, ProviderTuple } from '../injector';
import { Startup } from './startup';
import { bootManager } from './boot_manager';
import { defaultLogger, Logger } from '../logger';

export function boot(target: Type<Startup> | ((inject: Injector) => PromiseOr<void>) | Startup, rootProviders: (Type | object | ProviderTuple)[] = []) {
  bootManager.setStartup(
    async () => {
      let configurable: Startup;

      const providers = new ProviderCollection();

      // defaultLogger.level = LogLevel.None;
      providers.add(Logger, defaultLogger); // TODO: Make it configurable.
      providers.addAll(rootProviders);

      function createInjector() {
        return new Injector(providers);
      }

      if (isClass(target)) {
        providers.add(target as Type<Startup>);
        configurable = createInjector().get(target as Type<Startup>);
      } else if (isFunction(target)) {
        configurable = { start: target as ((inject: Injector) => PromiseOr<void>) };
      } else {
        configurable = target as Startup;
      }

      if (configurable.providers) {
        providers.addAll(configurable.providers);
      }

      if (configurable.configure) {
        await configurable.configure(providers);
      }

      for (const moduleType of configurable.dependencies || []) {
        providers.add(moduleType);
        const module = createInjector().get(moduleType);

        if (module.providers) {
          providers.addAll(module.providers);
        }

        if (module.configure) {
          await module.configure(providers);
        }
      }

      const injector = createInjector();
      configurable.start(injector);
    },
  );
}
