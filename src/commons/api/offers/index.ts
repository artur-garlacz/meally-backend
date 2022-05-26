import { ResponseAction, ResponseDetails } from '@commons/data';
import { PaginationRequest, PaginationResponse } from '@commons/pagination';
import {
  OfferCategoryEntity,
  OfferEntity,
  OfferOrderEntity,
} from '@modules/offers/entities';

export type RangeFilter = {
  from: number;
  to: number;
};

export enum OfferStatus {
  draft = 'draft',
  published = 'published',
  archived = 'archived',
}

export enum OfferOrderStatus {
  created = 'created',
  accepted = 'accepted',
  prepared = 'prepared',
  delivered = 'delivered',
  rejected = 'rejected',
}

export type UpdateOfferType = Partial<Omit<OfferEntity, 'userId'>>;

export type OfferStatusType = keyof typeof OfferStatus;
export type OfferOrderStatusType = keyof typeof OfferOrderStatus;

export type GetOffersRequestQuery = {
  offerCategoryId?: string;
  page?: string;
  perPage?: string;
  title?: string;
};

export type OfferFilterQuery = Omit<
  GetOffersRequestQuery,
  'page' | 'perPage'
> & {
  status?: OfferStatusType;
} & Partial<PaginationRequest>;

export type GetOffersResponse = PaginationResponse<OfferEntity>;

export type GetOfferResponse = ResponseDetails<OfferEntity> | ResponseAction;

export type GetOfferOrderResponse =
  | ResponseDetails<OfferOrderEntity>
  | ResponseAction;

export type GetOfferCategoriesResponse = ResponseDetails<OfferCategoryEntity[]>;

export type CreateOfferBody = {
  offer: {
    title: string;
    unitPrice: number;
    longDesc: string;
    shortDesc: string;
    availableQuantity: number;
    offerCategoryId: string;
  };
};
