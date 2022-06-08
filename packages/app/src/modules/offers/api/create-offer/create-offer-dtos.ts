import { z } from 'zod';

// Request Body
export type CreateOfferRequestBody = z.infer<typeof createOfferSchema>;

export const createOfferSchema = z.object({
  body: z.object({
    offer: z.object({
      title: z.string({
        required_error: 'Title is required',
      }),
      unitPrice: z.number({ required_error: 'Unit price is required' }),
      longDesc: z.string({ required_error: 'Description is required' }),
      shortDesc: z
        .string({ required_error: 'Short description is required' })
        .max(300, 'Max length is 300 chars'),
      availableQuantity: z.number({
        required_error: 'Available quantity is required',
      }),
      offerCategoryId: z.string({ required_error: 'Category id is required' }),
    }),
  }),
});
