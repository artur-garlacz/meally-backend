import { HttpErrorResponseBody } from '@commons/errors';
import { ValidationError } from 'class-validator';

export class HttpErrorResponse extends Error {
  constructor(
    readonly statusCode: number,
    readonly body: HttpErrorResponseBody,
  ) {
    super(body.message);
    Object.setPrototypeOf(this, HttpErrorResponse.prototype);
  }
}

export class TransformError extends Error {
  constructor(
    readonly message: string,
    readonly validationErrors: ValidationError[],
  ) {
    super(message);
    Object.setPrototypeOf(this, TransformError.prototype);
  }
}
