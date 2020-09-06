/**
 * Functional type that combine {@link Iterable} and {@link AsyncIterable}
 */
export type AnyIterable<E> = Iterable<E> | AsyncIterable<E>;
