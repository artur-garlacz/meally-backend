import { z } from 'zod';

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthUserRequestBody = z.infer<typeof authUserSchema>;

export const authUserSchema = z.object({
  body: z.object({
    user: z.object({
      email: z
        .string({
          required_error: 'Email is required',
        })
        .email('Not a valid email'),
      password: z.string({ required_error: 'Password is required' }),
    }),
  }),
});

export type AuthRefreshTokenRequestBody = z.infer<
  typeof authRefreshTokenSchema
>;

export const authRefreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string({
      required_error: 'refreshToken is required',
    }),
  }),
});
