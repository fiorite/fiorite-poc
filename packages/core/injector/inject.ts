import 'reflect-metadata';

import { Equatable, InvalidOperationError, Selector } from '../functional_types';
import { ServiceKey } from './service_key';
import { Collection, HashMap } from '../collections';
import { ServiceFactory } from './service_factory';

// Identifier.

class ReflectKey implements Equatable {
  constructor(
    readonly target: Object,
    readonly propertyKey?: string | symbol,
    readonly parameterIndex?: number,
  ) { }

  [Symbol.equals](other: unknown): boolean {
    return other instanceof ReflectKey &&
      other.target === this.target &&
      other.propertyKey === this.propertyKey &&
      other.parameterIndex === this.parameterIndex;
  }
}

export const injectRegistry = new HashMap<ReflectKey, ServiceFactory>();

export const wire: ClassDecorator = () => void 0;

// export function Inject<T>(): PropertyDecorator;

export function inject<T>(key: ServiceKey<T>): ParameterDecorator;
export function inject<T>(key: ServiceKey<T>): PropertyDecorator;
export function inject<T, R>(key: ServiceKey<T>, selector: Selector<T, R>): ParameterDecorator;
export function inject<T, R>(key: ServiceKey<T>, selector: Selector<T, R>): PropertyDecorator;
export function inject<T>(key: ServiceKey): any {
  return (target: Object, propertyKey?: string | symbol, parameterIndex?: number) => {
    if (!propertyKey) {
      return;
    }

    let provide: ServiceFactory;

    if (arguments.length === 2) {
      // Property
      const type = Reflect.getMetadata('design:type', target, propertyKey!);

      if (type === Collection) {
        throw new InvalidOperationError(`Use @InjectAll(ServiceKey) for collection injection.`);
      }

      provide = injector => injector.get(key);
    } else if (arguments.length === 3) {
      // Parameter

      // Property

      if (!propertyKey) {
        // Constructor

        const type = Reflect.getMetadata('design:paramtypes', target, propertyKey!)[parameterIndex!];

        if (type !== Collection) {
          throw new InvalidOperationError(`Use @InjectAll(ServiceKey) for collection injection.`);
        }

        provide = injector => injector.get(key);
      } else {
        // Method

        const type = Reflect.getMetadata('design:paramtypes', target, propertyKey!)[parameterIndex!];

        if (type !== Collection) {
          throw new InvalidOperationError(`Use @InjectAll(ServiceKey) for collection injection.`);
        }

        provide = injector => injector.get(key);
      }
    } else {
      throw new InvalidOperationError();
    }

    const reflectKey = new ReflectKey(target, propertyKey, parameterIndex);

    injectRegistry.add(reflectKey, provide);
  };

}

export function injectAll<T>(key: ServiceKey<T>): PropertyDecorator & ParameterDecorator;
export function injectAll<T, R>(key: ServiceKey<T>, selector: Selector<Collection<T>, R>): ParameterDecorator;
export function injectAll<T, R>(key: ServiceKey<T>, selector: Selector<Collection<T>, R>): PropertyDecorator;
export function injectAll<T>(key: ServiceKey<T>): any {
  return function (target: Object, propertyKey?: string | symbol, parameterIndex?: number) {
    let provide: ServiceFactory;

    if (typeof parameterIndex === 'number') {
      // Parameter

      // Property

      if (!propertyKey) {
        // Constructor

        const type = Reflect.getMetadata('design:paramtypes', target, propertyKey!)[parameterIndex!];

        if (type !== Collection) {
          throw new InvalidOperationError(`Use @Inject([ServiceKey]) for non-collection injection.`);
        }

        provide = injector => injector.getAll(key);
      } else {
        // Method

        console.log(arguments);
        const type = Reflect.getMetadata('design:paramtypes', target, propertyKey!)[parameterIndex!];

        if (type !== Collection) {
          throw new InvalidOperationError(`Use @Inject([ServiceKey]) for non-collection injection.`);
        }

        provide = injector => injector.getAll(key);
      }
    } else if (['string', 'symbol'].includes(typeof propertyKey)) {
      // Property
      const type = Reflect.getMetadata('design:type', target, propertyKey!);

      if (type !== Collection) {
        throw new InvalidOperationError(`Use @Inject([ServiceKey]) for non-collection injection.`);
      }

      provide = injector => injector.getAll(key);
    } else {
      throw new InvalidOperationError();
    }

    const reflectKey = new ReflectKey(target, propertyKey, parameterIndex);

    injectRegistry.add(reflectKey, provide);
  };
}

// export function InjectAll<T>(key: ServiceKey<T>): ParameterDecorator;
// export function InjectAll<T>(key: ServiceKey<T>): PropertyDecorator;
// export function InjectAll<T, R>(key: ServiceKey<T>, selector: Selector<T, R>): ParameterDecorator;
// export function InjectAll<T, R>(key: ServiceKey<T>, selector: Selector<T, R>): PropertyDecorator;
// export function InjectAll<T>(): any {
//   return () => void 0;
// }
