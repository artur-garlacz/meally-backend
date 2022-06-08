import { Offers } from '@commons/domain';
import { ErrorType, HttpErrorResponseBody } from '@commons/errors';
import { ApiRoutes } from '@commons/routes';
import { getTestDbClient } from '@setup-integration-tests.spec';
import { assert } from 'chai';
import { describe } from 'mocha';

import { DbClient } from '@libs/db';
import { serializeJson } from '@libs/utils/serialization';

import { UserEntity } from '@modules/users/entities';

import { dummies } from '@tests/dummies';
import {
  TestRequest,
  TestResponse,
  getTestRequest,
  requestAuth,
} from '@tests/requests';

describe.only('@Integration CreateOffer', () => {
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

  it('should return offer data', async () => {
    const offer = dummies.offer();

    const response: TestResponse<Offers.GetOfferResponse> = await testRequest
      .authPost(ApiRoutes.offers.createOffer(), user1)
      .expect(500);

    console.log(response);
  });
});
