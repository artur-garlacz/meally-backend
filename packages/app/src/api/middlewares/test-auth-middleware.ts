import { AuthRequest, RequestSender } from '@app/commons/request';
import { NextFunction, Request, Response } from 'express';

import logger from '@lib/utils/logger';

export const TEST_AUTH_HEADER = 'mock-test-auth';

export function testAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const sender = getSender(req);
  if (!sender) {
    return res.sendStatus(401);
  }

  (req as AuthRequest).sender = sender;
  return next();
}

function getSender(req: Request): RequestSender | null {
  const testAuthHeader = req.headers[TEST_AUTH_HEADER] as string | undefined;
  if (!testAuthHeader) {
    logger.error('There is no test auth header');
    return null;
  }
  try {
    return JSON.parse(testAuthHeader);
  } catch (error) {
    logger.error('Cannot parse mock test auth', {
      headerValue: testAuthHeader,
    });
    return null;
  }
}
