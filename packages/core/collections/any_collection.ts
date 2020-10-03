import { Collection } from './collection';
import { AsyncCollection } from './async_collection';

export type AnyCollection<E> = Collection<E> | AsyncCollection<E>;
