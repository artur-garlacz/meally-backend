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

  //   await dbClient.createMintingOption({
  //     mintingOptionId: '22b06884-7149-42e6-a4ec-4c75ca551c66',
  //     name: 'Ballada o dojrzałości 2',
  //     cover: 'https://app.dev.cloud.najbacoin.com/b-o-d-2.jpg',
  //     embedUrl: 'https://open.spotify.com/embed/track/65YtWeTpusS7BvGjz78Apr',
  //     expectedMentions: ['kruligh'],
  //     isrc: 'PL57G2000280',
  //   });
  //   await dbClient.createMintingOption({
  //     mintingOptionId: 'a99be76a-564c-4454-8386-69898e5557e4',
  //     name: 'Ballada o starej nokii',
  //     cover: 'https://app.dev.cloud.najbacoin.com/b-o-starej-nokii.jpg',
  //     embedUrl: 'https://open.spotify.com/embed/track/6pFudKm37STaoMX5fYgdLR',
  //     expectedMentions: ['kruligh'],
  //     isrc: 'PL57G2100365',
  //   });

  const user1 = await dbClient.createUser(
    dummies.user({
      email: 'dev1@gmail.com',
    }),
  );
  //   const user2 = await dbClient.createUser(
  //     dummies.user({ email: 'najbamjusik+dev2@gmail.com' }),
  //   );
  //   await dbClient.createUser(
  //     dummies.user({ email: 'najbamjusik+dev3@gmail.com' }),
  //   );

  //   await dbClient.createInstagramAccount({
  //     userId: user1.userId,
  //     nickname: 'kruligh_2',
  //   });
  //   await dbClient.createInstagramAccount({
  //     userId: user2.userId,
  //     nickname: 'najbacoin',
  //   });

  //   await dbClient.createTransaction({
  //     txId: uuid(),
  //     fromUser: null,
  //     toUser: user1.userId,
  //     amount: 100,
  //     requestedAt: new Date(),
  //     comment: 'starter pack',
  //   });

  //   for (let i = 0; i < 10; i++) {
  //     await dbClient.createPromotion([
  //       {
  //         price: 10,
  //         discountValue: 0.5,
  //         discountType: PromotionDiscountType.Percentage,
  //         promotionId: uuid(),
  //         promotionCode: uuid().split('-')[0],
  //         createdAt: new Date(),
  //       },
  //     ]);
  //   }
}
