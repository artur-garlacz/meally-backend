import { DatabasePool } from 'slonik';

import { createDbClient } from '@app/libs/db';

import logger from '@lib/utils/logger';

import { dummies } from '@app/tests/dummies';

import { toPasswordHash } from '../utils/password';

export async function runSeed(dbPool: DatabasePool) {
  logger.info('Running db seed', {});
  const dbClient = createDbClient(dbPool);

  const user1 = await dbClient.createUser(
    dummies.user({
      email: 'dev1@gmail.com',
    }),
  );

  const user2 = await dbClient.createUser(
    dummies.user({
      email: 'dev2@gmail.com',
    }),
  );

  const hashPassword = await toPasswordHash('test');

  await dbClient.createUserPassword(
    dummies.userPassword({
      userId: user1.userId,
      password: hashPassword,
    }),
  );

  await dbClient.createUserPassword(
    dummies.userPassword({
      userId: user2.userId,
      password: hashPassword,
    }),
  );

  const offerCategory1 = await dbClient.createOfferCategory(
    dummies.offerCategory({
      name: 'Italian kitchen',
    }),
  );

  const offerCategory2 = await dbClient.createOfferCategory(
    dummies.offerCategory({
      name: 'Polish kitchen',
    }),
  );
  const offerCategory3 = await dbClient.createOfferCategory(
    dummies.offerCategory({
      name: 'Chinese kitchen',
    }),
  );

  for (let i = 0; i < 20; i++) {
    let offer = await dbClient.createOffer(
      dummies.offer({
        userId: i % 2 == 0 ? user1.userId : user2.userId,
        offerCategoryId:
          i % 3 == 0
            ? offerCategory3.offerCategoryId
            : i % 2 == 0
            ? offerCategory2.offerCategoryId
            : offerCategory1.offerCategoryId,
      }),
    );

    await dbClient.createOrder(
      dummies.order({
        offerId: offer.offerId,
        customerId: i % 2 == 1 ? user1.userId : user2.userId,
      }),
    );
  }
}
