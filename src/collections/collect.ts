import { CollectionProxy } from './collection';

export function collect<E>(iterable: Iterable<E>): CollectionProxy<E> {
  return new CollectionProxy(iterable);
}
