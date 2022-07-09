import { z } from 'zod';

import { OrderStatus } from '../get-orders';

export type UpdateOrderStatusRequestBody = z.infer<
  typeof updateOrderStatusSchema
>;

export const updateOrderStatusSchema = z.object({
  body: z.object({
    order: z.object({
      status: z.enum([
        OrderStatus.accepted,
        OrderStatus.prepared,
        OrderStatus.delivered,
        OrderStatus.rejected,
      ]),
    }),
  }),
});
