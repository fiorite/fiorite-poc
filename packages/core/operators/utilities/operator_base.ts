import { Callable } from '../../callable';
import { Operator } from '../functional_types';
import { getIterator } from './get_iterator';

/**
 * @deprecated Idea for the future.
 */
export abstract class OperatorBase<E, R = Iterable<E>> extends Callable<Operator<E, R>> {
  protected abstract operate(iterable: Iterable<E>): R;

  protected getIterator(iterable: Iterable<E>): Iterator<E> {
    return getIterator(iterable);
  }

  [Symbol.invoke](iterable: Iterable<E>): R {
    return this.operate(iterable);
  }
}
