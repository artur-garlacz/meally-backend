import { assert } from 'chai';
import { isDeepStrictEqual } from 'util';
import { DbClient } from '@libs/db';
import { getTestDbClient } from '@setup-integration-tests.spec';
import { dummies } from '@tests/dummies';

describe('@Integration User queries', () => {
  let dbClient: DbClient;
  const user = dummies.user();

  beforeEach(async () => {
    dbClient = await getTestDbClient();
  });

  describe('DbClient.CreateUser', () => {
    it('Should insert user', async () => {
      await dbClient.createUser(user);
      assert.isTrue(true);
    });
  });

  describe('DbClient.CreateUserDetails | DbClient.GetUserDetails', () => {
    it('Should insert data to user details and then verify returned data', async () => {
      await dbClient.createUser(user);
      const userDetails = dummies.userDetails({
        userId: user.userId,
        address2: null,
      });
      await dbClient.createUserDetails(userDetails);
      assert.isTrue(true);
      const receivedUserDetails = await dbClient.getUserDetails(user.userId);
      assert.isTrue(isDeepStrictEqual(userDetails, receivedUserDetails));
    });
  });
});
