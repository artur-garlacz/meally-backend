import { AppServices } from '@app/app-services';
import { wrap } from '@app/libs/utils/express';
import { offerApiRouter } from '@app/modules/offers/api';
import { orderApiRouter } from '@app/modules/orders/api';
import { userApiRouter } from '@app/modules/users/api';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import logger from '@lib/utils/logger';

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

  const swaggerDocs = swaggerJsDoc(services.swaggerClient.swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  app.use('/api/user', express.json(), wrap(userApiRouter(services)));
  app.use('/api/orders', express.json(), wrap(orderApiRouter(services)));
  app.use('/api/offers', express.json(), wrap(offerApiRouter(services)));
  // ---
  // end middlewares
  // ---
  app.use(errorsMiddleware());
  return app;
}
