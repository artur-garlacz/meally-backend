import { uuid } from '@libs/utils/common';
import { UserEntity } from '@modules/users/entities';

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
