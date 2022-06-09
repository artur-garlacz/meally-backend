import { ResponseDetails } from '@commons/data';
import {
  GetItemsRequestQuery,
  ItemsFilterQuery,
  PaginationResponse,
} from '@commons/pagination';

import {
  OfferCategoryEntity,
  OfferEntity,
} from '@modules/offers/domain/entities';

// Requests
type OffersQueryString = Partial<
  Pick<OfferEntity, 'offerCategoryId' | 'title' | 'status'>
>;

export type GetOffersRequestQuery = GetItemsRequestQuery<OffersQueryString>;

export type OfferFilterQuery = ItemsFilterQuery<OffersQueryString>;

// Response
export type GetOffersResponse = PaginationResponse<OfferEntity>;

//index
export type GetOfferResponse = ResponseDetails<OfferEntity>;

export type GetOfferCategoriesResponse = ResponseDetails<OfferCategoryEntity[]>;

export type RangeFilter = {
  from: number;
  to: number;
};

export enum OfferStatus {
  draft = 'draft',
  published = 'published',
  archived = 'archived',
}

export type UpdateOfferType = Partial<Omit<OfferEntity, 'userId'>>;

export type OfferStatusType = keyof typeof OfferStatus;
