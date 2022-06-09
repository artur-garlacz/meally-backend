import { ResponseDetails } from '@commons/data';
import {
  GetItemsRequestQuery,
  ItemsFilterQuery,
  PaginationResponse,
} from '@commons/pagination';

import { OrderEntity } from '@modules/orders/domain/entities';

export enum OrderStatus {
  created = 'created',
  accepted = 'accepted',
  prepared = 'prepared',
  delivered = 'delivered',
  rejected = 'rejected',
}

export type OrderStatusType = keyof typeof OrderStatus;

//Request
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

//Response
export type GetOrderResponse = ResponseDetails<OrderEntity>;

export type GetOrdersResponse = PaginationResponse<OrderEntity>;
