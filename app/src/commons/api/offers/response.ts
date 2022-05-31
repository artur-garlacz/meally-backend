import { ResponseAction, ResponseDetails } from '@commons/data';
import { PaginationResponse } from '@commons/pagination';

import { OfferCategoryEntity, OfferEntity } from '@modules/offers/entities';

// show
export type GetOffersResponse = PaginationResponse<OfferEntity>;

//index
export type GetOfferResponse = ResponseDetails<OfferEntity> | ResponseAction;

export type GetOfferCategoriesResponse = ResponseDetails<OfferCategoryEntity[]>;
