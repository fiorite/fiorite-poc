/**
 * @deprecated use {@link clone.object} instead.
 * @param object
 * @param extra
 */
export function cloneObject<T extends object>(object: T, extra: Partial<T> = {}): T {
  return Object.assign(Object.create(object), { ...object, ...extra });
}
