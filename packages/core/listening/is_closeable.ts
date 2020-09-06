import { isMethod } from '../util';

export function isCloseable(object: unknown): boolean {
  return isMethod(object, Symbol.close);
}
