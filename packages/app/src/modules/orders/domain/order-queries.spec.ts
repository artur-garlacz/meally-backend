import { getTestDbClient } from '@setup-integration-tests.spec';
import { assert } from 'chai';

import { DbClient } from '@libs/db';

import { OfferCategoryEntity } from '@modules/offers/domain/entities';
import { UserEntity } from '@modules/users/domain/entities';

import { dummies } from '@tests/dummies';

import { OrderStatus } from '../api/get-orders';

describe('@Integration Order queries', () => {
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

      const mockOrder = dummies.order({
        offerId: offer.offerId,
        customerId: customer.userId,
      });

      const createdOrder = await dbClient.createOrder(mockOrder);

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

  describe('DbClient.getPaginatedCustomerOrders & DbClient.getPaginatedMerchantOrders', () => {
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
            status: i % 2 == 0 ? OrderStatus.accepted : OrderStatus.delivered,
          }),
        );
      }
    });

    describe('DbClient.getPaginatedCustomerOrders', () => {
      it('get orders with default filters', async () => {
        const data = await dbClient.getPaginatedCustomerOrders({
          customerId: user2.userId,
        });
        assert.equal(data.items.length, 10);
        assert.equal(data.itemsCount, 10);
        assert.equal(data.perPage, 10);
        assert.equal(data.page, 1);
      });

      it('get orders with default perPage and page is 2', async () => {
        const data = await dbClient.getPaginatedCustomerOrders({
          customerId: user2.userId,
          page: '2',
        });

        assert.equal(data.items.length, 10);
        assert.equal(data.itemsCount, 10);
        assert.equal(data.perPage, 10);
        assert.equal(data.page, 2);
      });

      it('get orders with default page and perPage is 20', async () => {
        const data = await dbClient.getPaginatedCustomerOrders({
          customerId: user2.userId,
          perPage: '20',
        });

        assert.equal(data.items.length, 20);
        assert.equal(data.itemsCount, 20);
        assert.equal(data.perPage, 20);
        assert.equal(data.page, 1);
      });

      it('get orders with page 3 and perPage is 5', async () => {
        const data = await dbClient.getPaginatedCustomerOrders({
          customerId: user2.userId,
          perPage: '5',
          page: '3',
        });

        assert.equal(data.items.length, 5);
        assert.equal(data.itemsCount, 5);
        assert.equal(data.perPage, 5);
        assert.equal(data.page, 3);
      });

      it('get orders with offerCategoryId filter', async () => {
        const data = await dbClient.getPaginatedCustomerOrders({
          customerId: user2.userId,
          status: OrderStatus.accepted,
          perPage: '15',
        });

        assert.equal(data.items.length, 10);
        assert.equal(data.itemsCount, 10);
        assert.equal(data.perPage, 15);
        assert.equal(data.page, 1);
      });
    });

    // describe('DbClient.getPaginatedMerchantOrders', () => {
    // it('get orders with default filters', async () => {
    //   const data = await dbClient.getPaginatedMerchantOrders({
    //     userId: user1.userId,
    //   });
    //   assert.equal(data.items.length, 10);
    //   assert.equal(data.itemsCount, 10);
    //   assert.equal(data.perPage, 10);
    //   assert.equal(data.page, 1);
    // });
    // it('get orders with default perPage and page is 2', async () => {
    //   const data = await dbClient.getPaginatedMerchantOrders({
    //     userId: user1.userId,
    //     page: '2',
    //   });
    //   assert.equal(data.items.length, 10);
    //   assert.equal(data.itemsCount, 10);
    //   assert.equal(data.perPage, 10);
    //   assert.equal(data.page, 2);
    // });
    // it('get orders with default page and perPage is 20', async () => {
    //   const data = await dbClient.getPaginatedMerchantOrders({
    //     userId: user1.userId,
    //     perPage: '20',
    //   });
    //   assert.equal(data.items.length, 20);
    //   assert.equal(data.itemsCount, 20);
    //   assert.equal(data.perPage, 20);
    //   assert.equal(data.page, 1);
    // });
    // it('get orders with page 3 and perPage is 5', async () => {
    //   const data = await dbClient.getPaginatedMerchantOrders({
    //     userId: user1.userId,
    //     perPage: '5',
    //     page: '3',
    //   });
    //   assert.equal(data.items.length, 5);
    //   assert.equal(data.itemsCount, 5);
    //   assert.equal(data.perPage, 5);
    //   assert.equal(data.page, 3);
    // });
    // it('get orders with offerCategoryId filter', async () => {
    //   const data = await dbClient.getPaginatedMerchantOrders({
    //     userId: user1.userId,
    //     status: OrderStatus.accepted,
    //     perPage: '15',
    //   });
    //   assert.equal(data.items.length, 10);
    //   assert.equal(data.itemsCount, 10);
    //   assert.equal(data.perPage, 15);
    //   assert.equal(data.page, 1);
    // });
    // });
  });
});
