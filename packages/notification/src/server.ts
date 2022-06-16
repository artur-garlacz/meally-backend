import { createServer } from 'http';

import logger from '@notify/utils/logger';
import { getEnv } from '@notify/utils/env';
import { buildAppServices } from '@notify/implementation/app-services';
import { buildRouter } from '@notify/implementation/express/router';

async function main() {
  const httpPort = getEnv('APP_PORT');
  const appServices = await buildAppServices();
  const router = await buildRouter(appServices);

  const server = createServer(router);
  server.listen(httpPort, () => {
    logger.info(`Server is running at http://localhost:${httpPort}`);
  });
  return Promise.resolve();
}

main()
  .then(() => logger.info('Server running'))
  .catch((err) => {
    logger.error('Server failed', err);
    process.exit(1);
  });
