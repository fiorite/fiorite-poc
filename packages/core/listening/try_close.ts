import { Closeable } from './closeable';
import { isCloseable } from './is_closeable';
import { close } from './close';

export async function tryClose(instance: unknown): Promise<boolean> {
  if (isCloseable(instance)) {
    await close(instance as Closeable);

    return true;
  }

  return false;
}
