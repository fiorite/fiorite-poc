import { InvalidOperationError } from '../errors';

export class HashMapError<K> extends InvalidOperationError {
  constructor(message: string, readonly key: K) {
    super(message);
  }
}
