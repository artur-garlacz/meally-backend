import { ValidationError } from 'class-validator';

export enum ErrorType {
  NotFound = 'NotFound',
  Unhandled = 'unhandled',
  HttpErrorResponse = 'HttpErrorResponse',
  Transform = 'Transform',
}

export type HttpErrorResponseBody = {
  message: string;
  kind?: ErrorType;
  validationErrors?: ValidationError[];
};
