import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

export const validateMiddleware =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  };
