import { StatusCode } from './status_code';

export abstract class HttpError extends Error {
  name = 'HttpError';

  protected constructor(
    message = 'An error occurred.',
    readonly statusCode: StatusCode | number,
  ) {
    super(message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = 'Not Found.') {
    super(message, StatusCode.NotFound);
  }
}

export class InternalServerError extends HttpError {
  constructor(message = 'Internal Server Error.') {
    super(message, StatusCode.InternalServerError);
  }
}
