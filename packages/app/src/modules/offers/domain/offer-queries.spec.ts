import { getTestDbClient } from '@setup-integration-tests.spec';
import { assert } from 'chai';

import { DbClient } from '@libs/db';
import { uuid } from '@libs/utils/common';

import { UserEntity } from '@modules/users/domain/entities';

import { dummies } from '@tests/dummies';

import { OfferCategoryEntity } from './entities';

describe('@Integration Offer queries', () => {
  let dbClient: DbClient;
  const offerCategory = dummies.offerCategory();
  const user = dummies.user();

  beforeEach(async () => {
    dbClient = await getTestDbClient();
  });

  describe('DbClient.createOffer', () => {
    it('should insert offer with created category', async () => {
      await dbClient.createUser(user);
      const category = await dbClient.createOfferCategory(offerCategory);
      assert.isTrue(true);
      const offer = dummies.offer({
        offerCategoryId: category.offerCategoryId,
        userId: user.userId,
      });
      await dbClient.createOffer(offer);
    });
  });

  describe('DbClient.getOffers & DbClient.getOffer', () => {
    let user1: UserEntity,
      offerCategory1: OfferCategoryEntity,
      offerCategory2: OfferCategoryEntity;

    beforeEach(async () => {
      user1 = await dbClient.createUser(
        dummies.user({
          email: 'dev1@gmail.com',
        }),
      );

      offerCategory1 = await dbClient.createOfferCategory(
        dummies.offerCategory({
          name: 'Kuchnia włoska',
        }),
      );

      offerCategory2 = await dbClient.createOfferCategory(
        dummies.offerCategory({
          name: 'Kuchnia polska',
        }),
      );

      for (let i = 0; i < 20; i++) {
        await dbClient.createOffer(
          dummies.offer({
            userId: user1.userId,
            offerCategoryId:
              i % 2 == 0
                ? offerCategory2.offerCategoryId
                : offerCategory1.offerCategoryId,
          }),
        );
      }
    });

    describe('DbClient.getOffers', () => {
      it('get offers with default filters', async () => {
        const data = await dbClient.getPaginatedOffers({});

        assert.equal(data.items.length, 10);
        assert.equal(data.itemsCount, 10);
        assert.equal(data.perPage, 10);
        assert.equal(data.page, 1);
      });

      it('get offers with default perPage and page is 2', async () => {
        const data = await dbClient.getPaginatedOffers({ page: '2' });

        assert.equal(data.items.length, 10);
        assert.equal(data.itemsCount, 10);
        assert.equal(data.perPage, 10);
        assert.equal(data.page, 2);
      });

      it('get offers with default page and perPage is 20', async () => {
        const data = await dbClient.getPaginatedOffers({ perPage: '20' });

        assert.equal(data.items.length, 20);
        assert.equal(data.itemsCount, 20);
        assert.equal(data.perPage, 20);
        assert.equal(data.page, 1);
      });

      it('get offers with page 3 and perPage is 5', async () => {
        const data = await dbClient.getPaginatedOffers({
          perPage: '5',
          page: '3',
        });

        assert.equal(data.items.length, 5);
        assert.equal(data.itemsCount, 5);
        assert.equal(data.perPage, 5);
        assert.equal(data.page, 3);
      });

      it('get offers with offerCategoryId filter', async () => {
        const data = await dbClient.getPaginatedOffers({
          offerCategoryId: offerCategory2.offerCategoryId,
          perPage: '15',
        });

        assert.equal(data.items.length, 10);
        assert.equal(data.itemsCount, 10);
        assert.equal(data.perPage, 15);
        assert.equal(data.page, 1);

        data.items.forEach((offer) => {
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

  describe('DbClient.createOfferOrder', () => {
    let user1: UserEntity, offerCategory1: OfferCategoryEntity;

    beforeEach(async () => {
      user1 = await dbClient.createUser(
        dummies.user({
          email: 'dev1@gmail.com',
        }),
      );

      offerCategory1 = await dbClient.createOfferCategory(
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

    it('create order', () => {});
  });
});
