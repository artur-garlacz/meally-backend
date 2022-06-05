import { Orders } from '@commons/api';
import { ErrorType } from '@commons/errors';

import { HttpErrorResponse } from '@libs/utils/errors';

export function verifyOrderStatus(
  currStatus: Orders.OrderStatusType,
  newStatus: Orders.OrderStatusType,
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
        return Orders.OrderStatus.accepted;
      }
      throw new HttpErrorResponse(400, {
        message: 'Cannot change order status',
        kind: ErrorType.UnprocessableEntity,
      });
    case 'prepared':
      if (currStatus === 'accepted') {
        return Orders.OrderStatus.prepared;
      }
      throw new HttpErrorResponse(400, {
        message: 'Cannot change order status',
        kind: ErrorType.UnprocessableEntity,
      });
    case 'delivered':
      if (currStatus === 'prepared') {
        return Orders.OrderStatus.delivered;
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
