import { InvalidOperationError } from '../types';

export class HashMapError<K> extends InvalidOperationError {
  constructor(message: string, readonly key: K) {
    super(message);
  }
}