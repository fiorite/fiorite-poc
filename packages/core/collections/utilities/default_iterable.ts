import { NotImplementedError } from '../../errors';
import { proxyIterable } from './iterable_proxy';

export const defaultIterable: Iterable<never> = proxyIterable<never>(() => {
  throw new NotImplementedError();
});
