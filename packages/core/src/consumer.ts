import { PromiseOr } from './promise-or';

/**
 * Action that performs on indexed element and returns no result.
 */
export type Consumer<E> = (element: E, index: number) => void;

/**
 * Action that performs on indexed element and returns no result.
 */
export type AsyncConsumer<E> = (element: E, index: number) => PromiseOr<void>;
