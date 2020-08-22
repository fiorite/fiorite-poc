export class InvalidOperationError extends Error {
  name = 'InvalidOperationError';

  constructor(message: string = 'An operation is failed.') {
    super(message);
  }
}

/**
 * Alias for {@link InvalidOperationError}.
 */
export const InvalidOperation = InvalidOperationError;

export class NotImplementedError extends Error {
  name = 'NotImplementedError';

  constructor(message: string = 'An operation is not implemented.') {
    super(message);
  }
}

/**
 * Alias for {@link NotImplementedError}.
 */
export const NotImplemented = NotImplementedError;

