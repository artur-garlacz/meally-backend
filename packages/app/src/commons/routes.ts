const userApiPath = '/api/users';
const offerApiPath = '/api/offers';

export const ApiRoutes = {
  users: {
    me: () => `${userApiPath}/me`,
    details: () => `${userApiPath}/details`,
    login: () => `${userApiPath}/login`,
    register: () => `${userApiPath}/register`,
  },
  offers: {
    getOffer: ({ offerId }: { offerId: string }) =>
      `${offerApiPath}/${offerId}`,
    getOffers: () => `${offerApiPath}`,
  },
};
