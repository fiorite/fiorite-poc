import { PromiseOr } from './promise-or';

/**
 * Action that performs on element and returns no result.
 */
export type Consumer<E, A extends unknown[] = never[]> = (element: E, ...args: A) => void;

/**
 * Action that performs on element and returns no result.
 */
export type AsyncConsumer<E, A extends unknown[] = never[]> = (element: E, ...args: A) => PromiseOr<void>;
