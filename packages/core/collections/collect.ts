import { AsyncCollection } from './async_collection';
import { AnyIterable, isAsyncIterable, isIterable } from '../operators';
import { ArgumentError } from '../errors';
import { Collection } from './collection';
import { AnyCollection } from './any_collection';

/**
 * Creates a new {@link Collection} using {@link Collection[Symbol.species]} constructor.
 *
 * @param iterable
 */
export function collect<E>(iterable: Iterable<E>): Collection<E>;

/**
 * Creates a new {@link AsyncCollection} using {@link AsyncCollection[Symbol.species]} constructor.
 *
 * @param iterable
 */
export function collect<E>(iterable: AsyncIterable<E>): AsyncCollection<E>;

/**
 * @inheritDoc
 */
export function collect<E>(iterable: AnyIterable<E>): AnyCollection<E> {
  if (isIterable(iterable)) {
    return new Collection[Symbol.species](iterable as Iterable<E>);
  } else if (isAsyncIterable(iterable)) {
    return new AsyncCollection[Symbol.species](iterable as AsyncIterable<E>);
  }

  throw new ArgumentError(); // TODO: Add better message.
}
