import { Callable } from '../../callable';
import { AsyncOperator } from '../functional_types';
import { getAsyncIterator } from './get_async_iterator';

/**
 * @deprecated Idea for the future.
 */
export abstract class AsyncOperatorBase<E, R = AsyncIterable<E>> extends Callable<AsyncOperator<E, R>> {
  abstract operate(iterable: AsyncIterable<E>): R;

  protected getIterator(iterable: AsyncIterable<E>): AsyncIterator<E> {
    return getAsyncIterator(iterable);
  }

  [Symbol.invoke](iterable: AsyncIterable<E>): R {
    return this.operate(iterable);
  }
}
