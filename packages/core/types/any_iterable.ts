/**
 * Functional type that describes union of {@link Iterable} and {@link AsyncIterable}
 */
export type AnyIterable<E> = Iterable<E> | AsyncIterable<E>;
