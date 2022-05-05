// import { DatabasePoolType } from 'slonik';
// import logger from 'najba/utils/logger';
// import { createDbClient } from 'najba/db';
// import { PromotionDiscountType } from 'najba/commons/model';
// import { uuid } from 'najba/commons';
// import { dummies } from 'najba/tests/dummies';

import { createDbClient } from '@libs/db';
import logger from '@libs/utils/logger';
import { dummies } from '@tests/dummies';
import { DatabasePool } from 'slonik';

export async function runSeed(dbPool: DatabasePool) {
  logger.info('Running db seed', {});
  const dbClient = createDbClient(dbPool);

  const user1 = await dbClient.createUser(
    dummies.user({
      email: 'dev1@gmail.com',
    }),
  );

  console.log('User created');

  const offerCategory1 = await dbClient.createOfferCategory(
    dummies.offerCategory({
      name: 'Kuchnia włoska',
    }),
  );

  console.log('Category 1 created');

  const offerCategory2 = await dbClient.createOfferCategory(
    dummies.offerCategory({
      name: 'Kuchnia polska',
    }),
  );
  const offerCategory3 = await dbClient.createOfferCategory(
    dummies.offerCategory({
      name: 'Kuchnia chińska',
    }),
  );

  for (let i = 0; i < 20; i++) {
    await dbClient.createOffer(
      dummies.offer({
        userId: user1.userId,
        offerCategoryId:
          i % 3 == 0
            ? offerCategory3.offerCategoryId
            : i % 2 == 0
            ? offerCategory2.offerCategoryId
            : offerCategory1.offerCategoryId,
      }),
    );
  }
}
