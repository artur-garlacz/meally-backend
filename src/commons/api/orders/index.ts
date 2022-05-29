import { ResponseAction, ResponseDetails } from '@commons/data';
import { OrderEntity } from '@modules/orders/entities';
import { OrderStatus } from '../offers';

export type OrderStatusType = keyof typeof OrderStatus;

export type GetOrderResponse = ResponseDetails<OrderEntity> | ResponseAction;
