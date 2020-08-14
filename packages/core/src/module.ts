import { AppBuilder } from './app.builder';
import { ProviderCollection } from './di';
import { Type } from './common';
import { HashMap } from './collections';
import { forEach } from '@fiorite/core/operators';

export interface Module {
  provide?(injector: ProviderCollection): void;
  configure?(app: AppBuilder): void;
}

export interface ModuleOpts {
  providers: Iterable<Type>;
}

const moduleMetadata = new HashMap<Type, ModuleOpts>();

interface ModuleRef<T extends Module = Module> {
  type: Type<T>;
  instance: T;
  services: ProviderCollection;
}

export function Module(options: ModuleOpts): ClassDecorator {
  return target => {
    moduleMetadata.add(Type.cast(target), options);
  }
}

export namespace Module {
  // TODO: Provide services
  export function create(moduleType: Type<Module>, providers: ProviderCollection = new ProviderCollection()): ModuleRef {
    const injector = providers[Symbol.clone]().add(moduleType).toInjector();

    const moduleInjection = new ProviderCollection();

    if (moduleMetadata.has(moduleType)) {
      const options = moduleMetadata.get(moduleType);

      forEach(options.providers, providers.add.bind(providers));
    }

    const moduleInstance = injector.get(moduleType);

    if (moduleInstance.provide) {
      moduleInstance.provide(providers);
    }

    // TODO: Add configure.

    return { type: moduleType, instance: moduleInstance, services: moduleInjection };
  }
}

export const module: ClassDecorator = () => void 0;
