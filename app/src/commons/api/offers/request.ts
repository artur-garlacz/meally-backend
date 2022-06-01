import { GetItemsRequestQuery, ItemsFilterQuery } from '@commons/pagination';

import { OfferEntity } from '@modules/offers/entities';

type OffersQueryString = Partial<
  Pick<OfferEntity, 'offerCategoryId' | 'title' | 'status'>
>;

export type GetOffersRequestQuery = GetItemsRequestQuery<OffersQueryString>;

export type OfferFilterQuery = ItemsFilterQuery<OffersQueryString>;
