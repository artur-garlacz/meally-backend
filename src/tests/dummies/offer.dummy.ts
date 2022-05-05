import { OfferStatus } from '@commons/api/offers';
import faker from '@faker-js/faker';
import { uuid } from '@libs/utils/common';
import { OfferCategoryEntity, OfferEntity } from '@modules/offers/entities';
import { MockBuilder } from './user.dummy';

export const offer: MockBuilder<OfferEntity> = (partial = {}): OfferEntity => {
  return {
    offerId: uuid(),
    title: faker.name.jobTitle(),
    unitPrice: faker.datatype.float({ min: 0, max: 1000 }),
    longDesc: faker.lorem.paragraphs(1),
    shortDesc: faker.lorem.paragraphs(1),
    status: faker.helpers.arrayElement([
      OfferStatus.published,
      OfferStatus.draft,
      OfferStatus.archived,
    ]),
    availableQuantity: faker.datatype.number({ min: 0, max: 1000 }),
    promoted: faker.datatype.boolean(),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: uuid(),
    offerCategoryId: uuid(),
    ...partial,
  };
};

export const offerCategory: MockBuilder<OfferCategoryEntity> = (
  partial = {},
): OfferCategoryEntity => {
  return {
    offerCategoryId: uuid(),
    name: faker.name.jobTitle(),
    shortDesc: faker.lorem.paragraphs(1),
    ...partial,
  };
};
