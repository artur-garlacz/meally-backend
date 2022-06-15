import { ValidationError } from 'class-validator';

export enum ErrorType {
  BadRequest = 'BadRequest',
  NotFound = 'NotFound',
  InsufficientQuantity = 'InsufficientQuantity',
  Unhandled = 'Unhandled',
  Unauthorized = 'Unauthorized',
  HttpErrorResponse = 'HttpErrorResponse',
  UnprocessableEntity = 'UnprocessableEntity',
  Transform = 'Transform',
  CognitoError = 'CognitoError',
}

export type HttpErrorResponseBody = {
  message: string;
  kind?: ErrorType;
  validationErrors?: ValidationError[];
};

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
