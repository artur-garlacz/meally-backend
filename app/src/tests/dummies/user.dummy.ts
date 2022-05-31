import faker from '@faker-js/faker';

import { uuid } from '@libs/utils/common';

import { UserDetailsEntity, UserEntity } from '@modules/users/entities';

export type MockBuilder<Entity> = (partial?: Partial<Entity>) => Entity;

export const user: MockBuilder<UserEntity> = (partial = {}): UserEntity => {
  return {
    userId: uuid(),
    password: 'test',
    email: `user-${uuid().slice(0, 6)}@email.com`,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...partial,
  };
};

export const userDetails: MockBuilder<UserDetailsEntity> = (
  partial = {},
): UserDetailsEntity => {
  return {
    userDetailsId: uuid(),
    userId: uuid(),
    address1: faker.address.streetAddress(),
    address2: faker.address.streetAddress(),
    city: faker.address.city(),
    postalCode: faker.address.zipCode(),
    country: faker.address.country(),
    phoneNumber: faker.phone.phoneNumber('###-###-###'),
    ...partial,
  };
};
