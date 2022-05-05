import { PaginationRequest } from '@commons/pagination';
import { OfferEntity } from '@modules/offers/entities';

export type OfferFilterQuery = {
  categoryId: string;
  price: {
    from: number;
    to: number;
  };
  title: string;
} & PaginationRequest;

export enum OfferStatus {
  draft = 'draft',
  published = 'published',
  archived = 'archived',
}

export type UpdateOfferType = Partial<Omit<OfferEntity, 'userId'>>;

export type OfferStatusType = keyof typeof OfferStatus;
