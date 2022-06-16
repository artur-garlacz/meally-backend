import { getTestDbClient } from '@app/setup-integration-tests.spec';
import { assert, expect } from 'chai';
import { UniqueIntegrityConstraintViolationError } from 'slonik';

import { DbClient } from '@app/libs/db';

import { assertThrows } from '@app/tests/assertions';
import { dummies } from '@app/tests/dummies';

describe('@Integration User queries', () => {
  let dbClient: DbClient;
  const user = dummies.user();

  beforeEach(async () => {
    dbClient = await getTestDbClient();
  });

  describe('DbClient.CreateUser', () => {
    it('should insert user data', async () => {
      const createdUser = await dbClient.createUser(user);
      const receivedUser = await dbClient.getUser(user.userId);
      assert.isNotNull(receivedUser);
      assert.deepEqual(createdUser, receivedUser);
    });

    // unique email
    it('should fail if user does not have unique email', async () => {
      await assertThrows({
        method: async () => {
          await dbClient.createUser(user);
          await dbClient.createUser(dummies.user({ email: user.email }));
        },
        assertions: (err) => {
          assert.instanceOf(err, UniqueIntegrityConstraintViolationError);
        },
      });
    });
  });

  describe('DbClient.CreateUserDetails', () => {
    it('should insert data to user details and then verify returned data', async () => {
      await dbClient.createUser(user);
      const userDetails = dummies.userDetails({
        userId: user.userId,
        address2: null,
      });
      await dbClient.createUserDetails(userDetails);
      const createdUserDetails = await dbClient.getUserDetails(user.userId);
      assert.deepEqual(userDetails, createdUserDetails);
    });

    it('should return null if user does not exist', async () => {
      const nullableUser = await dbClient.getUser(user.userId);
      expect(nullableUser).to.be.a('null');
    });
  });
});
