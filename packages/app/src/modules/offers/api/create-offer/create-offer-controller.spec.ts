import { HttpErrorResponseBody } from '@commons/errors';
import { ApiRoutes } from '@commons/routes';
import { getTestDbClient } from '@setup-integration-tests.spec';
import { assert } from 'chai';
import { describe } from 'mocha';

import { DbClient } from '@libs/db';

import { UserEntity } from '@modules/users/domain/entities';

import { dummies } from '@tests/dummies';
import {
  TestRequest,
  TestResponse,
  getTestRequest,
  requestAuth,
} from '@tests/requests';

describe('@Integration CreateOffer', () => {
  let dbClient: DbClient;
  let testRequest: TestRequest;
  let user1: UserEntity;

  beforeEach(async () => {
    testRequest = await getTestRequest();
    dbClient = await getTestDbClient();
    user1 = await dbClient.createUser(dummies.user());
  });

  it('should return 401 unauthorized error', async () => {
    const response: TestResponse<HttpErrorResponseBody> = await testRequest
      .post(ApiRoutes.offers.createOffer())
      .expect(401);
    assert.equal(response.status, 401);
  });
});
