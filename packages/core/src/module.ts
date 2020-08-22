import { Callback, Type } from './common';
import { Injector, Provider, ProviderCollection } from './di';
import { InvalidOperationError } from './errors';
import { HashMap } from './collections';

// export interface Module {
//   provide?(injector: InjectorBuilder): void;
//   configure?(app: AppBuilder): void;
// }
//
// export interface ModuleOpts {
//   providers: Iterable<Type>;
// }
//
// const moduleMetadata = new HashMap<Type, ModuleOpts>();
//
// interface ModuleRef<T extends Module = Module> {
//   type: Type<T>;
//   instance: T;
//   injector: InjectorBuilder;
// }
//
// export function Module(options: ModuleOpts): ClassDecorator {
//   return target => {
//     moduleMetadata.add(Type.cast(target), options);
//   }
// }
//
// export namespace Module {
//   // TODO: Provide services
//   export function create(moduleType: Type<Module>, builder: InjectorBuilder = new InjectorBuilder()): ModuleRef {
//     const injector = builder[Symbol.clone]().add(moduleType).build();
//
//     const moduleBuilder = new InjectorBuilder();
//
//     if (moduleMetadata.has(moduleType)) {
//       const options = moduleMetadata.get(moduleType);
//
//       builder.addAll(options.providers);
//     }
//
//     const moduleInstance = injector.get(moduleType);
//
//     if (moduleInstance.provide) {
//       moduleInstance.provide(builder);
//     }
//
//     // TODO: Add configure.
//
//     return { type: moduleType, instance: moduleInstance, injector: moduleBuilder };
//   }
// }
//
// export const module: ClassDecorator = () => void 0;

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
  if (providers.has(moduleType)) {
    throw new InvalidOperationError('Module "' + moduleType.name + '" already registered.');
  }

  const injector = providers.add(moduleType).createInjector();
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

  const injector = providers.createInjector();
  callback(injector);
}
