import { GetItemsRequestQuery, ItemsFilterQuery } from '@commons/pagination';

import { OrderEntity } from '@modules/orders/entities';

type CustomerOrdersQueryString = Partial<
  Pick<OrderEntity, 'customerId' | 'status'>
>;

export type GetCustomerOrdersRequestQuery =
  GetItemsRequestQuery<CustomerOrdersQueryString>;

export type CustomerOrderFilterQuery =
  ItemsFilterQuery<CustomerOrdersQueryString>;
