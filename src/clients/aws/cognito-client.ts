import {
  AdminGetUserCommand,
  CognitoIdentityProviderClient,
  ListUsersCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { ErrorType } from '@commons/errors';
import { AppConfig } from '@libs/utils/config';
import { HttpErrorResponse } from '@libs/utils/errors';
import logger from '@libs/utils/logger';
import CognitoExpress, { JwtToken } from 'cognito-express';

export function createCognitoClient(
  config: Pick<AppConfig, 'awsRegion' | 'cognitoConfig'>,
) {
  const cognitoIdp = new CognitoIdentityProviderClient({});
  const cognitoExpress = new CognitoExpress({
    region: config.awsRegion,
    cognitoUserPoolId: config.cognitoConfig.userPoolId,
    tokenUse: 'id',
  });

  return Object.freeze({
    validate(authorization: string) {
      return new Promise<JwtToken>((resolve, reject) =>
        cognitoExpress.validate(authorization, (error, token) => {
          if (error) {
            reject(error);
          } else {
            resolve(token);
          }
        }),
      ).then((token) => {
        return {
          cognitoUserId: token.sub as string,
          email: token.email as string | null | undefined,
        };
      });
    },
    getUser({ cognitoUserId }: { cognitoUserId: string }) {
      const adminGetUserCommand = new AdminGetUserCommand({
        UserPoolId: config.cognitoConfig.userPoolId,
        Username: cognitoUserId,
      });
      return cognitoIdp.send(adminGetUserCommand).catch(
        createCognitoErrorHandler(
          {
            operation: 'getUser',
            errorMessage: 'Cannot get user from Cognito',
          },
          { cognitoUserId },
        ),
      );
    },
    getUserDetailsByEmail({ email }: { email: string }) {
      const listUserCommand = new ListUsersCommand({
        Filter: `email=\"${email}\"`,
        UserPoolId: config.cognitoConfig.userPoolId,
      });
      return cognitoIdp.send(listUserCommand).catch(
        createCognitoErrorHandler(
          {
            operation: 'getUserDetailsByEmail',
            errorMessage: 'Cannot get user from Cognito using email',
          },
          { email },
        ),
      );
    },
  });
}

const createCognitoErrorHandler =
  <T extends object>(
    { operation, errorMessage }: { operation: string; errorMessage: string },
    logObj: T,
  ) =>
  (error: any): never => {
    const errorBody = {
      message: errorMessage,
      originalMessage: error.message || 'Unknown cognito message',
      code: error.code || 'Unknown cognito code',
    };
    logger.error(`[CognitoClient.${operation}]`, {
      ...(logObj || {}),
      errorBody,
      rawError: error,
    });
    throw new HttpErrorResponse(500, {
      kind: ErrorType.CognitoError,
      message: errorBody.message,
    });
  };
