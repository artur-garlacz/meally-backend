import faker from '@faker-js/faker';

import { uuid } from '@app/libs/utils/common';

import {
  UserDetailsEntity,
  UserEntity,
  UserPasswordEntity,
} from '@app/modules/users/domain/entities';

export type MockBuilder<Entity> = (partial?: Partial<Entity>) => Entity;

export const user: MockBuilder<UserEntity> = (partial = {}): UserEntity => {
  return {
    userId: uuid(),
    email: `user-${uuid().slice(0, 6)}@email.com`,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...partial,
  };
};

export const userPassword: MockBuilder<UserPasswordEntity> = (
  partial = {},
): UserPasswordEntity => {
  return {
    userPasswordId: uuid(),
    password: 'test',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: uuid(),
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
