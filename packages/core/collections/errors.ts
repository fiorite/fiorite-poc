import { OldInvalidOperationError } from '../errors';

export class HashMapError<K> extends OldInvalidOperationError {
  constructor(message: string, readonly key: K) {
    super(message);
  }
}
