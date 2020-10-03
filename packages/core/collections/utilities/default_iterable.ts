import { NotImplementedError } from '../../errors';
import { proxyIterator } from './iterator_proxy';

export const defaultIterable: Iterable<never> = proxyIterator<never>(() => {
  throw new NotImplementedError();
});
