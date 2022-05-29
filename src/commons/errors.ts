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
