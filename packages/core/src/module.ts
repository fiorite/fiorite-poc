import { AppBuilder } from './app.builder';
import { InjectorBuilder } from './di';
import { Type } from './common';
import { HashMap } from './collections';

export interface Module {
  provide?(injector: InjectorBuilder): void;
  configure?(app: AppBuilder): void;
}

export interface ModuleOpts {
  providers: Iterable<Type>;
}

const moduleMetadata = new HashMap<Type, ModuleOpts>();

interface ModuleRef<T extends Module = Module> {
  type: Type<T>;
  instance: T;
  injector: InjectorBuilder;
}

export function Module(options: ModuleOpts): ClassDecorator {
  return target => {
    moduleMetadata.add(Type.cast(target), options);
  }
}

export namespace Module {
  // TODO: Provide services
  export function create(moduleType: Type<Module>, builder: InjectorBuilder = new InjectorBuilder()): ModuleRef {
    const injector = builder[Symbol.clone]().add(moduleType).build();

    const moduleBuilder = new InjectorBuilder();

    if (moduleMetadata.has(moduleType)) {
      const options = moduleMetadata.get(moduleType);

      builder.addAll(options.providers);
    }

    const moduleInstance = injector.get(moduleType);

    if (moduleInstance.provide) {
      moduleInstance.provide(builder);
    }

    // TODO: Add configure.

    return { type: moduleType, instance: moduleInstance, injector: moduleBuilder };
  }
}

export const module: ClassDecorator = () => void 0;
