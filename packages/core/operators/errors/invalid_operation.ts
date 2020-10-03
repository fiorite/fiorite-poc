export class InvalidOperationError extends Error {
  name = 'InvalidOperationError';

  constructor(message: string = 'An operation is failed.') {
    super(message);
  }
}
