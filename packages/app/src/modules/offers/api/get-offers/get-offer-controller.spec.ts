import { Offers } from '@commons/domain';
import { ErrorType, HttpErrorResponseBody } from '@commons/errors';
import { ApiRoutes } from '@commons/routes';
import { getTestDbClient } from '@setup-integration-tests.spec';
import { assert } from 'chai';
import { describe } from 'mocha';

import { DbClient } from '@libs/db';

import { dummies } from '@tests/dummies';
import { TestRequest, TestResponse, getTestRequest } from '@tests/requests';

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

    const { body }: TestResponse<Offers.GetOfferResponse> = await testRequest
      .get(ApiRoutes.offers.getOffer({ offerId: receivedOffer?.offerId! }))
      .expect(200);

    // assert.equal()

    // assert.deepEqual(serializeJson(body.data), serializeJson(offer));
    // assert.deepEqual(serializeJson(body.data), serializeJson(receivedOffer));
  });
});
