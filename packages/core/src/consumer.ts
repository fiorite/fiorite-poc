import { PromiseOr } from './promise-or';

/**
 * Action that performs on element and returns no result.
 */
export type Consumer<E> = (element: E) => void;

/**
 * Action that performs on indexed element and returns no result.
 */
export type IndexedConsumer<E> = (element: E, index: number) => void;

/**
 * Action that performs on element and returns no result.
 */
export type AsyncConsumer<E> = (element: E) => PromiseOr<void>;

/**
 * Action that performs on indexed element and returns no result.
 */
export type IndexedAsyncConsumer<E> = (element: E, index: number) => void;
