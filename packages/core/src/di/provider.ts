import { Instance, Type } from '../common';
import { NotImplementedError } from '../errors';
import { ServiceKey } from './service_key';
import { ServiceLifetime } from './service_lifetime';
import { Provide } from './provide';
import { ProviderDescriptor } from './provider_descriptor';

export type TypeProvider<T> = Type<T>;
export type InstanceProvider<T> = Instance<T>;
export type AliasProvider<T> = [ServiceKey<T>, ServiceKey<T>];
export type AliasProviderWithLifetime<T> = [ServiceKey<T>, ServiceKey<T>, ServiceLifetime];
export type ArgumentativeProvider<T> = [Type<T>, ConstructorParameters<Type<T>>];
export type ArgumentativeProviderWithLifetime<T> = [Type<T>, ConstructorParameters<Type<T>>, ServiceLifetime];
export type FactoryProvider<T> = [Type<T>, Provide<T>];
export type FactoryProviderWithLifetime<T> = [Type<T>, Provide<T>, ServiceLifetime];

export type Provider<T = unknown> = Type<T>
  | Instance<T>
  | [ServiceKey<T>, ServiceKey<T>]
  | [];

export namespace Provider {
  export function create(): ProviderDescriptor {
    throw new NotImplementedError()
  }

  export function transient(): ProviderDescriptor {
    throw new NotImplementedError()
  }

  export function scoped(): ProviderDescriptor {
    throw new NotImplementedError()
  }

  export function singleton(): ProviderDescriptor {
    throw new NotImplementedError()
  }
}
