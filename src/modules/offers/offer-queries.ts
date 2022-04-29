import logger from '@libs/utils/logger';
import { CommonQueryMethods, sql } from 'slonik';
import { OfferCategoryEntity, OfferEntity } from './entities';

export function offersQueries(db: CommonQueryMethods) {
  return Object.freeze({
    getAllOffers(): Promise<readonly OfferEntity[]> {
      logger.debug('DbClient.getAllOffers');
      return db.many(sql`SELECT * FROM "offer"`);
    },
    getAllOfferCategories(): Promise<readonly OfferCategoryEntity[]> {
      logger.debug('DbClient.getAllOfferCategories');
      return db.many(sql`SELECT * FROM "offerCategory"`);
    },
  });
}

export function getOfferFilter() {}
