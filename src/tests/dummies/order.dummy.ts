import { OrderStatus } from '@commons/api/offers';
import faker from '@faker-js/faker';
import { uuid } from '@libs/utils/common';
import { OrderEntity } from '@modules/orders/entities';
import { MockBuilder } from './user.dummy';

export const order: MockBuilder<OrderEntity> = (partial = {}): OrderEntity => {
  return {
    offerOrderId: uuid(),
    status: faker.helpers.arrayElement([
      OrderStatus.accepted,
      OrderStatus.created,
      OrderStatus.delivered,
      OrderStatus.prepared,
      OrderStatus.rejected,
    ]),
    quantity: faker.datatype.number({ min: 0, max: 1000 }),
    createdAt: new Date(),
    updatedAt: new Date(),
    offerId: uuid(),
    customerId: uuid(),
    ...partial,
  };
};
