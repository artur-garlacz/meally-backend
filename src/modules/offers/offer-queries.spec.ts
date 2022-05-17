import { assert } from 'chai';
import { isDeepStrictEqual } from 'util';
import { DbClient } from '@libs/db';
import { getTestDbClient } from '@setup-integration-tests.spec';
import { dummies } from '@tests/dummies';

describe('@Integration Offer queries', () => {
  let dbClient: DbClient;
  const offerCategory = dummies.offerCategory();
  const user = dummies.user();

  beforeEach(async () => {
    dbClient = await getTestDbClient();
  });

  //   describe('DbClient.createOffer', () => {
  //     it('should insert offer with created category', async () => {
  //       await dbClient.createUser(user);
  //       assert.isTrue(true);
  //       const category = await dbClient.createOfferCategory(offerCategory);
  //       assert.isTrue(true);
  //       const offer = dummies.offer({
  //         offerCategoryId: category.offerCategoryId,
  //         userId: user.userId,
  //       });
  //       await dbClient.createOffer(offer);
  //       assert.isTrue(true);
  //     });
  //   });

  describe('DbClient.getOffers', () => {
    beforeEach(async () => {
      const user1 = await dbClient.createUser(
        dummies.user({
          email: 'dev1@gmail.com',
        }),
      );

      const offerCategory1 = await dbClient.createOfferCategory(
        dummies.offerCategory({
          name: 'Kuchnia włoska',
        }),
      );

      for (let i = 0; i < 20; i++) {
        await dbClient.createOffer(
          dummies.offer({
            userId: user1.userId,
            offerCategoryId: offerCategory1.offerCategoryId,
          }),
        );
      }
    });

    it('get offers with default filters', async () => {
      const offers = await dbClient.getAllOffers({});
      console.log(offers.length);
    });
  });
});
