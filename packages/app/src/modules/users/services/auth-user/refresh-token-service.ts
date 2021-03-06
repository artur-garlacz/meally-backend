import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '@app/libs/utils/jwt';

export const refreshToken = async (refreshToken: string) => {
  const userId = (await verifyRefreshToken(refreshToken)) as string;
  const accessToken = await signAccessToken(userId);
  // const newRefreshToken = await signRefreshToken()(userId);
  return { accessToken };
};
