import { z } from 'zod';

export type CreateOrderRequestBody = z.infer<typeof createOrderSchema>;

export const createOrderSchema = z.object({
  body: z.object({
    offerOrder: z.object({
      quantity: z.number({
        required_error: 'Quantity is required',
      }),
    }),
  }),
});
