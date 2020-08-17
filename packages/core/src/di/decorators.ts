import { Selector, Type } from '../common';
import { Injector } from './injector';
import { HashMap } from '../collections';
import { InjectionLifetime } from './lifetime';
import { InjectionKey } from './key';

export type InjectionFactory<T = unknown> = (injector: Injector) => T;

export const providerRegistry = new HashMap<Type, InjectionLifetime>();

export function Inject(): ParameterDecorator;
export function Inject<T>(key: InjectionKey<T>): ParameterDecorator;
export function Inject<T, R>(key: InjectionKey<T>, selector: Selector<T, R>): ParameterDecorator;
export function Inject<T, R>(key?: InjectionKey<T>, selector?: Selector<T, R>): ParameterDecorator {
  return () => void 0;
}

export function Injectable(): ClassDecorator {
  return () => void 0;
}

export const Singleton = (): ClassDecorator => {
  return target => {
    providerRegistry.add(Type.cast(target), InjectionLifetime.Singleton);
  };
};

export const Scoped = (): ClassDecorator => {
  return target => {
    providerRegistry.add(Type.cast(target), InjectionLifetime.Scoped);
  };
};

export const Transient = (): ClassDecorator => {
  return target => {
    providerRegistry.add(Type.cast(target), InjectionLifetime.Transient);
  };
};
