import { AppServices } from '@app-services';
import { wrap } from '@libs/utils/express';
import logger from '@libs/utils/logger';
import { userApiRouter } from '@modules/users/router';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { errorsMiddleware } from './middlewares/errors-middleware';

export async function buildRouter(services: AppServices) {
  const { appConfig } = services;
  logger.debug('Building app router');
  // ---
  // start middlewares
  // ---

  const app = express();
  app.use(helmet());
  app.use(
    cors({
      origin: '*',
      // origin: [/http:\/\/localhost\:\d+/, /najbamjusik\.com$/],
      optionsSuccessStatus: 200,
    }),
  );

  app.use('/api/user', express.json(), wrap(userApiRouter(services)));
  // ---
  // end middlewares
  // ---
  app.use(errorsMiddleware());
  return app;
}
