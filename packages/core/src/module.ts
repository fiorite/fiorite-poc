import { Callback, Type } from './common';
import { Injector, ProviderCollection } from './di';
import { InvalidOperationError } from './errors';
import { HashMap } from './collections';

export interface Module {
  configure(providers: ProviderCollection): void;
}

const MODULE_REGISTRY = new HashMap<Type, Type[]>();

export function Module(providers: Type[]): ClassDecorator {
  return target => {
    MODULE_REGISTRY.add(target as unknown as Type, providers);
  }
}

export function provideModule(moduleType: Type<Module>, providers: ProviderCollection) {
  if (providers.hasKey(moduleType)) {
    throw new InvalidOperationError('Module "' + moduleType.name + '" already registered.');
  }

  const injector = new Injector(providers.add(moduleType));
  const module = injector.get(moduleType);

  providers.addAll(
    MODULE_REGISTRY.tryGet(moduleType, []),
  );

  // providers.addAll(module.providers || []);
  (module.configure || (() => void 0))(providers);
}

export function runModule(moduleType: Type<Module>, callback: Callback<Injector>) {
  const providers = new ProviderCollection();
  provideModule(moduleType, providers);

  const injector = new Injector(providers);
  callback(injector);
}
