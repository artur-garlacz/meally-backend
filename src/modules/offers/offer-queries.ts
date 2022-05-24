import { OfferFilterQuery, UpdateOfferType } from '@commons/api/offers';
import { setPaginationQuery } from '@commons/pagination';
import logger from '@libs/utils/logger';
import { chainOptional, toMany, toOptional } from '@libs/utils/query';
import { serializeDate } from '@libs/utils/serialization';
import { CommonQueryMethods, sql } from 'slonik';
import { OfferCategoryEntity, OfferEntity } from './entities';

export function getOffersParams({
  page = 1,
  perPage = 10,
  ...args
}: OfferFilterQuery) {
  return {
    paginateCondition: setPaginationQuery({ page, perPage }),
    whereCondition: chainOptional(args as any, 'select'),
  };
}

export function offersQueries(db: CommonQueryMethods) {
  return Object.freeze({
    createOffer(offer: OfferEntity): Promise<OfferEntity> {
      logger.debug('DbClient.createOffer');

      return db.one(sql`
        INSERT INTO "offer" (
            "offerId",
            "title",
            "unitPrice",
            "longDesc",
            "shortDesc",
            "status",
            "availableQuantity",
            "promoted",
            "createdAt",
            "updatedAt",
            "userId",
            "offerCategoryId") 
        VALUES (${offer.offerId},
                ${offer.title},
                ${offer.unitPrice},
                ${offer.longDesc},
                ${offer.shortDesc},
                ${offer.status},
                ${offer.availableQuantity},
                ${offer.promoted},
                ${serializeDate(offer.createdAt)},
                ${serializeDate(offer.updatedAt)},
                ${offer.userId},
                ${offer.offerCategoryId}
        ) RETURNING *
      `);
    },
    updateOffer({
      offerId,
      userId,
      updateOffer,
    }: {
      offerId: OfferEntity['offerId'];
      userId: OfferEntity['userId'];
      updateOffer: UpdateOfferType;
    }): Promise<OfferEntity> {
      logger.debug('DbClient.updateOffer');

      return db.one(sql`
        UPDATE "offer"
        SET
        ${chainOptional(
          {
            title: updateOffer.title,
            unitPrice: updateOffer.unitPrice,
            longDesc: updateOffer.longDesc,
            shortDesc: updateOffer.shortDesc,
            status: updateOffer.status,
            availableQuantity: updateOffer.availableQuantity,
            promoted: updateOffer.promoted,
          },
          'update',
        )}
        WHERE "offerId" = ${offerId}
        AND "userId" = ${userId}
        RETURNING *`);
    },
    getOffers(args: OfferFilterQuery): Promise<OfferEntity[]> {
      logger.debug('DbClient.getAllOffers');

      const { paginateCondition, whereCondition } = getOffersParams(args);

      return db
        .query(
          sql`SELECT * FROM "offer" WHERE ${whereCondition} ORDER BY "offerId" ${paginateCondition}`,
        )
        .then(toMany(OfferEntity));
    },
    getOfferById(offerId: OfferEntity['offerId']): Promise<OfferEntity | null> {
      logger.debug('DbClient.getOfferById');

      return db
        .maybeOne(sql`SELECT * FROM "offer" WHERE "offerId"=${offerId}`)
        .then(toOptional(OfferEntity));
    },
    createOfferCategory(
      offer: OfferCategoryEntity,
    ): Promise<OfferCategoryEntity> {
      logger.debug('DbClient.createOfferCategory');

      return db.one(
        sql`
          INSERT INTO "offerCategory" (
              "offerCategoryId",
              "name",
              "shortDesc"
          ) VALUES (
              ${offer.offerCategoryId},
              ${offer.name},
              ${offer.shortDesc}
          ) RETURNING *`,
      );
    },
    getAllOfferCategories(): Promise<OfferCategoryEntity[]> {
      logger.debug('DbClient.getAllOfferCategories');

      return db
        .query(sql`SELECT * FROM "offerCategory"`)
        .then(toMany(OfferCategoryEntity));
    },
  });
}

export function getOfferFilter() {}
