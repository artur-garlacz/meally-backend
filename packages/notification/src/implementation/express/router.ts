import { AppServices } from '@notify/implementation/app-services';
import express from 'express';

import logger from '@lib/utils/logger';

import { errorsMiddleware } from './middlewares';
import helmet from 'helmet';
import cors from 'cors';
import { useChannels } from './channels';

export async function buildRouter(services: AppServices) {
  logger.debug('Building app router');
  // ---
  // start middlewares
  // ---

  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: '*',
      // origin: [/http:\/\/localhost\:\d+/, /\.com$/],
      optionsSuccessStatus: 200,
    }),
  );

  useChannels(services);

  // ---
  // end middlewares
  // ---
  app.use(errorsMiddleware());
  return app;
}
