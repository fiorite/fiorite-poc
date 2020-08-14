import { OperationError } from '../errors';

export class HashMapError<K> extends OperationError {
  constructor(message: string, readonly key: K) {
    super(message);
  }
}
