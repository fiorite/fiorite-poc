import { isNull } from './is_null';
import { isUndefined } from './is_undefined';

export function isNullOrUndefined(object: any): boolean {
  return isNull(object) || isUndefined(object);
}
