import { HttpErrorResponseBody } from '@app/commons/errors';
import { ApiRoutes } from '@app/commons/routes';
import { getTestDbClient } from '@app/setup-integration-tests.spec';
import { assert } from 'chai';
import { describe } from 'mocha';

import { DbClient } from '@app/libs/db';

import { UserEntity } from '@app/modules/users/domain/entities';

import { dummies } from '@app/tests/dummies';
import { TestRequest, TestResponse, getTestRequest } from '@app/tests/requests';

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
