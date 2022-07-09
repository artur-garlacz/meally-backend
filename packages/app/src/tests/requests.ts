import { AppServices, buildAppServices } from '@app/app-services';
import { AuthRequest, RequestSender } from '@app/commons/request';
import { getTestDbClient } from '@app/setup-integration-tests.spec';
import * as R from 'ramda';
import request from 'supertest';

import { TEST_AUTH_HEADER } from '@app/api/middlewares/test-auth-middleware';
import { buildRouter } from '@app/api/router';

import { getAppConfig } from '@app/libs/utils/config';
import { Environment } from '@app/libs/utils/env';
import { AsyncReturnType } from '@app/libs/utils/types';

async function buildTestExpressApp(args: Partial<AppServices> = {}) {
  const dbClient = args.dbClient || (await getTestDbClient());
  const appConfig = args.appConfig || (await getAppConfig());
  const appServices = await buildAppServices({
    ...args,
    appConfig: {
      ...appConfig,
      environment: Environment.test,
    },
    dbClient,
  });
  return buildRouter({
    ...appServices,
    dbClient,
    ...args,
  });
}

export type TestRequest = AsyncReturnType<typeof getTestRequest>;

export type TestResponse<B> = Omit<request.Response, 'body'> & { body: B };

export type TestSender = Partial<RequestSender> & Pick<RequestSender, 'userId'>;

export async function getTestRequest(args?: Partial<AppServices>) {
  const testRequest = request(await buildTestExpressApp(args));
  return {
    ...testRequest,
    authGet: (url: string, sender: TestSender) => {
      return testRequest.get(url).set(TEST_AUTH_HEADER, JSON.stringify(sender));
    },
    authPost: (url: string, sender: TestSender) => {
      return testRequest
        .post(url)
        .set(TEST_AUTH_HEADER, JSON.stringify(sender));
    },
    authPut: (url: string, sender: TestSender) => {
      return testRequest.put(url).set(TEST_AUTH_HEADER, JSON.stringify(sender));
    },
    authPatch: (url: string, sender: TestSender) => {
      return testRequest
        .patch(url)
        .set(TEST_AUTH_HEADER, JSON.stringify(sender));
    },
    authDelete: (url: string, sender: TestSender) => {
      return testRequest
        .delete(url)
        .set(TEST_AUTH_HEADER, JSON.stringify(sender));
    },
  };
}

export const requestAuth = R.curry(
  (sender: AuthRequest['sender'], req: request.Test): request.Test => {
    return req.set('mock-test-auth', JSON.stringify(sender));
  },
);
