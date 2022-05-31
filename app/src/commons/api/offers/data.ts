import { OfferEntity } from '@modules/offers/entities';

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
