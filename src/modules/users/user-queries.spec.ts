import { assert, expect } from 'chai';
import { DbClient } from '@libs/db';
import { getTestDbClient } from '@setup-integration-tests.spec';
import { dummies } from '@tests/dummies';
import { assertThrows } from '@tests/assertions';

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
          console.log(err);
          // UniqueIntegrityConstraintViolationError
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
