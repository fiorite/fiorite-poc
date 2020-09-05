import { bugs } from '../../../package.json';

export class ArgumentError extends Error {
  name = 'ArgumentError';

  constructor(message: string = 'An argument is incorrect.') {
    super(message);
  }
}

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

export class ArgumentsLengthError extends Error {
  name = 'ArgumentsLengthError';

  constructor();
  constructor(message: string);
  constructor(length: number, expected: number);
  constructor(length: number, expected: [number, number]);
  constructor(...args: any[]) {
    super(
      (() => {
        let message = 'Invalid arguments length.';

        if (args.length === 1 && typeof args[0] === 'string') {
          message = args[0];
        } else if (args.length === 2) {
          const [a, b] = args;

          if (Array.isArray(b)) {
            const [x, y] = b;

            message = `Expected ${x}-${y} arguments when ${a} was provided.`;
          } else {
            message = `Expected ${b} arguments when ${a} was provided.`;
          }
        }

        return message;
      })()
    );
  }
}

/**
 * Internal error.
 *
 * @internal
 */
export class InternalError extends Error {
  name = 'InternalError';

  constructor(message = 'Internal error.') {
    super(`${message}\n\nCreate an issue ${bugs.url}`);
  }
}
