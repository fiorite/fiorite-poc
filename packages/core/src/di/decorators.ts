import { HashMap } from '../collections';
import { Type } from '../common';
import { ServiceLifetime } from './service_lifetime';

export const providerRegistry = new HashMap<Type, ServiceLifetime>();

export function Injectable(): ClassDecorator {
  return () => void 0;
}

export const Singleton = (): ClassDecorator => {
  return target => {
    providerRegistry.add(Type.cast(target), ServiceLifetime.Singleton);
  };
};

export const Scoped = (): ClassDecorator => {
  return target => {
    providerRegistry.add(Type.cast(target), ServiceLifetime.Scoped);
  };
};

export const Transient = (): ClassDecorator => {
  return target => {
    providerRegistry.add(Type.cast(target), ServiceLifetime.Transient);
  };
};
