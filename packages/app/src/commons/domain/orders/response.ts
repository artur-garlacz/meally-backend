import { ResponseDetails } from '@commons/data';
import { PaginationResponse } from '@commons/pagination';

import { OrderEntity } from '@modules/orders/entities';

export type GetOrderResponse = ResponseDetails<OrderEntity>;

export type GetOrdersResponse = PaginationResponse<OrderEntity>;
