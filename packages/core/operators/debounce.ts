import { AsyncOperator } from './functional_types';
import { NotImplementedError } from '../errors';

export function debounceAsync<E>(milliseconds: number): AsyncOperator<E> {
  throw new NotImplementedError();
}
