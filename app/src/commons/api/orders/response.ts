import { ResponseAction, ResponseDetails } from '@commons/data';

import { OrderEntity } from '@modules/orders/entities';

export type GetOrderResponse = ResponseDetails<OrderEntity> | ResponseAction;
