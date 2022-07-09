import { AppServices } from '@app/app-services';
import { ErrorType } from '@app/commons/errors';

import { HttpErrorResponse } from '@app/libs/utils/errors';

import { OrderStatus, OrderStatusType } from '../api/get-orders';
import { UpdateOrderStatusRequestBody } from '../api/update-order';

export const updateOrderStatus =
  (app: AppServices) =>
  async ({
    order,
    orderId,
  }: UpdateOrderStatusRequestBody['body'] & { orderId: string }) => {
    const currOrder = await app.dbClient.getOrderById({
      offerOrderId: orderId!,
    });

    if (!currOrder) {
      throw new HttpErrorResponse(404, {
        message: 'Order not found',
        kind: ErrorType.NotFound,
      });
    }

    const newStatus = verifyOrderStatus(currOrder.status, order.status);

    const updatedOrder = await app.dbClient.updateOrderStatus({
      orderId: orderId!,
      status: newStatus,
    });

    return updatedOrder;
  };

export function verifyOrderStatus(
  currStatus: OrderStatusType,
  newStatus: OrderStatusType,
) {
  if (currStatus === 'rejected') {
    throw new HttpErrorResponse(400, {
      message: 'Cannot change rejected order status',
      kind: ErrorType.UnprocessableEntity,
    });
  }

  switch (newStatus) {
    case 'accepted':
      if (currStatus === 'created') {
        return OrderStatus.accepted;
      }
      throw new HttpErrorResponse(400, {
        message: 'Cannot change order status',
        kind: ErrorType.UnprocessableEntity,
      });
    case 'prepared':
      if (currStatus === 'accepted') {
        return OrderStatus.prepared;
      }
      throw new HttpErrorResponse(400, {
        message: 'Cannot change order status',
        kind: ErrorType.UnprocessableEntity,
      });
    case 'delivered':
      if (currStatus === 'prepared') {
        return OrderStatus.delivered;
      }
      throw new HttpErrorResponse(400, {
        message: 'Cannot change order status',
        kind: ErrorType.UnprocessableEntity,
      });
    default:
      throw new HttpErrorResponse(400, {
        message: 'Cannot change order status',
        kind: ErrorType.UnprocessableEntity,
      });
  }
}
