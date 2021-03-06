import faker from '@faker-js/faker';

import { uuid } from '@app/libs/utils/common';

import { OrderEntity } from '@app/modules/orders/domain/entities';

import { OrderStatus } from '../../modules/orders/api/get-orders';
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
