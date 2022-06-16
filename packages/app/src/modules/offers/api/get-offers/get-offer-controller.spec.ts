import { ErrorType, HttpErrorResponseBody } from '@app/commons/errors';
import { ApiRoutes } from '@app/commons/routes';
import { getTestDbClient } from '@app/setup-integration-tests.spec';
import { assert } from 'chai';
import { describe } from 'mocha';

import { DbClient } from '@app/libs/db';

import { serializeJson } from '@lib/utils/serialization';

import { dummies } from '@app/tests/dummies';
import { TestRequest, TestResponse, getTestRequest } from '@app/tests/requests';

import { GetOfferResponse } from './get-offer-dtos';

describe('@Integration GetSingleOffer', () => {
  let dbClient: DbClient;
  let testRequest: TestRequest;

  beforeEach(async () => {
    testRequest = await getTestRequest();
    dbClient = await getTestDbClient();
  });

  it('should return not found offer', async () => {
    const response: TestResponse<HttpErrorResponseBody> = await testRequest
      .get(ApiRoutes.offers.getOffer({ offerId: dummies.offer().offerId }))
      .expect(404);

    assert.equal(response.status, 404);
    assert.equal(response.body.kind, ErrorType.NotFound);
    assert.equal(response.body.message, 'Offer not found');
  });

  it('should return offer data', async () => {
    const offerCategory = dummies.offerCategory();
    const user = dummies.user();

    await dbClient.createUser(user);

    const category = await dbClient.createOfferCategory(offerCategory);

    const offer = dummies.offer({
      offerCategoryId: category.offerCategoryId,
      userId: user.userId,
      title: 'anyway',
    });
    await dbClient.createOffer(offer);

    await dbClient.createOffer(offer);

    const receivedOffer = await dbClient.getOfferById(offer.offerId);

    assert.isNotNull(receivedOffer);

    const { body }: TestResponse<GetOfferResponse> = await testRequest
      .get(ApiRoutes.offers.getOffer({ offerId: receivedOffer?.offerId! }))
      .expect(200);

    assert.deepEqual(serializeJson(body.data), serializeJson(offer));
    assert.deepEqual(serializeJson(body.data), serializeJson(receivedOffer));
  });
});
