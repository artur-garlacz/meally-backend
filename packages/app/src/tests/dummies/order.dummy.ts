import { Orders } from '@commons/domain';
import faker from '@faker-js/faker';

import { uuid } from '@libs/utils/common';

import { OrderEntity } from '@modules/orders/domain/entities';

import { MockBuilder } from './user.dummy';

export const order: MockBuilder<OrderEntity> = (partial = {}): OrderEntity => {
  return {
    offerOrderId: uuid(),
    status: faker.helpers.arrayElement([
      Orders.OrderStatus.accepted,
      Orders.OrderStatus.created,
      Orders.OrderStatus.delivered,
      Orders.OrderStatus.prepared,
      Orders.OrderStatus.rejected,
    ]),
    quantity: faker.datatype.number({ min: 0, max: 1000 }),
    createdAt: new Date(),
    updatedAt: new Date(),
    offerId: uuid(),
    customerId: uuid(),
    ...partial,
  };
};
