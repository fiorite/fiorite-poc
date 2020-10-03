import { isMethod } from '../utilities';

export function isCloseable(object: unknown): boolean {
  return isMethod(object, Symbol.close);
}
