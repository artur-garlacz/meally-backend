import { getTestDbClient } from '@setup-integration-tests.spec';
import { assert } from 'chai';

import { DbClient } from '@libs/db';
import { uuid } from '@libs/utils/common';

import { OfferCategoryEntity } from '@modules/offers/entities';
import { UserEntity } from '@modules/users/entities';

import { dummies } from '@tests/dummies';

describe('@Integration Offer queries', () => {
  let dbClient: DbClient;
  const offerCategory = dummies.offerCategory();
  const user = dummies.user();

  beforeEach(async () => {
    dbClient = await getTestDbClient();
  });

  describe('DbClient.createOrder', () => {
    it('should create and return order', async () => {
      await dbClient.createUser(user);
      const customer = await dbClient.createUser(dummies.user());
      const category = await dbClient.createOfferCategory(offerCategory);

      const offer = await dbClient.createOffer(
        dummies.offer({
          offerCategoryId: category.offerCategoryId,
          userId: user.userId,
        }),
      );

      const createdOrder = await dbClient.createOrder(
        dummies.order({
          offerId: offer.offerId,
          customerId: customer.userId,
        }),
      );

      const receivedOrder = await dbClient.getOrderById({
        offerOrderId: createdOrder.offerOrderId,
      });

      assert.deepEqual(
        receivedOrder,
        createdOrder,
        'Received order values are not equal to created order',
      );
    });
  });

  describe('DbClient.getOffers & DbClient.getOffer', () => {
    let user1: UserEntity,
      user2: UserEntity,
      offerCategory1: OfferCategoryEntity,
      offerCategory2: OfferCategoryEntity;

    beforeEach(async () => {
      user1 = await dbClient.createUser(
        dummies.user({
          email: 'dev1@gmail.com',
        }),
      );

      user2 = await dbClient.createUser(
        dummies.user({
          email: 'dev2@gmail.com',
        }),
      );

      offerCategory1 = await dbClient.createOfferCategory(
        dummies.offerCategory({
          name: 'Italian kitchen',
        }),
      );

      offerCategory2 = await dbClient.createOfferCategory(
        dummies.offerCategory({
          name: 'Polish kitchen',
        }),
      );

      for (let i = 0; i < 20; i++) {
        let offer = await dbClient.createOffer(
          dummies.offer({
            userId: user1.userId,
            offerCategoryId:
              i % 2 == 0
                ? offerCategory2.offerCategoryId
                : offerCategory1.offerCategoryId,
          }),
        );

        await dbClient.createOrder(
          dummies.order({
            offerId: offer.offerId,
            customerId: user2.userId,
          }),
        );
      }
    });

    describe('DbClient.getOrders', () => {
      it('get offers with default filters', async () => {
        const offers = await dbClient.getOffers({});
        assert.equal(offers.length, 10);
      });

      it('get offers with default perPage and page is 2', async () => {
        const offers = await dbClient.getOffers({ page: 2 });
        assert.equal(offers.length, 10);
      });

      it('get offers with default page and perPage is 20', async () => {
        const offers = await dbClient.getOffers({ perPage: 20 });
        assert.equal(offers.length, 20);
      });

      it('get offers with page 3 and perPage is 5', async () => {
        const offers = await dbClient.getOffers({ perPage: 5, page: 3 });
        assert.equal(offers.length, 5);
      });

      it('get offers with offerCategoryId filter', async () => {
        const offers = await dbClient.getOffers({
          offerCategoryId: offerCategory2.offerCategoryId,
          perPage: 15,
        });
        assert.equal(offers.length, 10);
        offers.forEach((offer) => {
          assert.equal(offer.offerCategoryId, offerCategory2.offerCategoryId);
        });
      });
    });

    describe('DbClient.getOfferById', () => {
      it('should return offer with proper offerId', async () => {
        const offer1 = await dbClient.createOffer(
          dummies.offer({
            userId: user1.userId,
            offerCategoryId: offerCategory1.offerCategoryId,
          }),
        );

        await dbClient.createOffer(
          dummies.offer({
            userId: user1.userId,
            offerCategoryId: offerCategory2.offerCategoryId,
          }),
        );

        const offer = await dbClient.getOfferById(offer1.offerId);
        assert.notEqual(offer, null);
        assert.equal(offer?.offerId, offer1.offerId);
      });

      it('should return null if offer does not exist', async () => {
        const offer = await dbClient.getOfferById(uuid());
        assert.equal(offer, null);
      });
    });
  });
});
