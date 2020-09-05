import { isMethod } from './is_method';

/**
 * Checks whether provider value is object that is instantiated from class.
 */
export function isInstance(value: unknown): boolean {
  return isMethod(value, 'constructor');
}
