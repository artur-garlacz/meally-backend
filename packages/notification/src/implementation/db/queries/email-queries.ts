import { CommonQueryMethods, sql } from 'slonik';

import logger from '@lib/utils/logger';
import { serializeDate } from '@lib/utils/serialization';
import { chainOptional } from '@lib/utils/query';

import { EmailEntity } from '../entities';

export function emailsQueries(db: CommonQueryMethods) {
  return Object.freeze({
    createEmail(
      email: Omit<EmailEntity, 'erroredAt' | 'sentAt'>,
    ): Promise<EmailEntity> {
      logger.info('[Command] DbClient.createEmail');

      return db.one(sql`
                INSERT INTO "email" (
                    "emailId",
                    "sendTo",
                    "createdAt",
                    "erroredAt",
                    "sentAt") 
                VALUES (${email.emailId},
                        ${email.sendTo},
                        ${serializeDate(email.createdAt)},
                        ${null},
                        ${null}
                ) RETURNING *
              `);
    },
    updateEmail(
      email: Partial<Pick<EmailEntity, 'erroredAt' | 'sentAt'>> &
        Pick<EmailEntity, 'emailId'>,
    ): Promise<EmailEntity> {
      logger.info('[Command] DbClient.updateEmail');

      return db.one(sql`
                  UPDATE "email" SET ${chainOptional(
                    { erroredAt: email.erroredAt, sentAt: email.sentAt },
                    'update',
                  )} WHERE "emailId"=${email.emailId} RETURNING *
                `);
    },
  });
}
