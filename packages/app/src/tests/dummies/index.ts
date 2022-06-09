import * as offer from './offer.dummy';
import * as order from './order.dummy';
import * as user from './user.dummy';

export const dummies = {
  ...user,
  ...offer,
  ...order,
};
