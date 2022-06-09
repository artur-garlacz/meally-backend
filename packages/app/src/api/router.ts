import { AppServices } from '@app-services';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { wrap } from '@libs/utils/express';
import logger from '@libs/utils/logger';

import { offerApiRouter } from '@modules/offers/api';
import { orderApiRouter } from '@modules/orders/api';
import { userApiRouter } from '@modules/users/api';

import { errorsMiddleware } from './middlewares';

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

  app.use('/api/user', express.json(), wrap(userApiRouter(services)));
  app.use('/api/orders', express.json(), wrap(orderApiRouter(services)));
  app.use('/api/offers', express.json(), wrap(offerApiRouter(services)));
  // ---
  // end middlewares
  // ---
  app.use(errorsMiddleware());
  return app;
}
