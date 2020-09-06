import { Closeable } from './closeable';

export function close(object: Closeable): void | Promise<void> {
  return object[Symbol.close]();
}
