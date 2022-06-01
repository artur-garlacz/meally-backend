import { GetItemsRequestQuery, ItemsFilterQuery } from '@commons/pagination';

import { OrderEntity } from '@modules/orders/entities';

type CustomerOrdersQueryString = Partial<
  Pick<OrderEntity, 'customerId' | 'status'>
>;

type MerchantOrdersQueryString = Partial<Pick<OrderEntity, 'status'>>;

export type GetCustomerOrdersRequestQuery =
  GetItemsRequestQuery<CustomerOrdersQueryString>;

export type CustomerOrderFilterQuery =
  ItemsFilterQuery<CustomerOrdersQueryString>;

export type GetMerchantOrdersRequestQuery =
  GetItemsRequestQuery<MerchantOrdersQueryString>;

export type MerchantOrderFilterQuery =
  ItemsFilterQuery<MerchantOrdersQueryString>;
