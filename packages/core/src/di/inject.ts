import { Selector } from '../common';
import { ServiceKey } from './service_key';

export function Inject<T>(key: ServiceKey<T>): ParameterDecorator;
export function Inject<T>(key: ServiceKey<T>): PropertyDecorator;
export function Inject<T, R>(key: ServiceKey<T>, selector: Selector<T, R>): ParameterDecorator;
export function Inject<T, R>(key: ServiceKey<T>, selector: Selector<T, R>): PropertyDecorator;
export function Inject<T>(): any {
  return (target: Object, propertyKey?: string | symbol, parameterIndex?: number) => {



  };
}

// export function InjectAll<T>(key: ServiceKey<T>): ParameterDecorator;
// export function InjectAll<T>(key: ServiceKey<T>): PropertyDecorator;
// export function InjectAll<T, R>(key: ServiceKey<T>, selector: Selector<T, R>): ParameterDecorator;
// export function InjectAll<T, R>(key: ServiceKey<T>, selector: Selector<T, R>): PropertyDecorator;
// export function InjectAll<T>(): any {
//   return () => void 0;
// }
