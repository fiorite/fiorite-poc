import { HashMap } from '../collections';
import { Type } from '../types';
import { ServiceLifetime } from './service_lifetime';

export const providerRegistry = new HashMap<Type, ServiceLifetime>();

export function Injectable(): ClassDecorator {
  return () => void 0;
}

export const injectable: ClassDecorator = () => void 0;

export const Singleton = (): ClassDecorator => {
  return target => {
    providerRegistry.add(Type.cast(target), ServiceLifetime.Singleton);
  };
};

export const singleton: ClassDecorator = () => void 0;

export const Scoped = (): ClassDecorator => {
  return target => {
    providerRegistry.add(Type.cast(target), ServiceLifetime.Scoped);
  };
};

export const scoped: ClassDecorator = () => void 0;

export const transient: ClassDecorator = () => void 0;

export const Transient = (): ClassDecorator => {
  return target => {
    providerRegistry.add(Type.cast(target), ServiceLifetime.Transient);
  };
};
