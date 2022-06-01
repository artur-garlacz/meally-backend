import { Offers } from '@commons/api';
import {
  PaginationResponse,
  setPaginationParams,
  setPaginationResponse,
} from '@commons/pagination';
import { CommonQueryMethods, sql } from 'slonik';

import logger from '@libs/utils/logger';
import { chainOptional, toMany, toOptional } from '@libs/utils/query';
import { serializeDate } from '@libs/utils/serialization';

import { OfferCategoryEntity, OfferEntity } from './entities';

export function offersQueries(db: CommonQueryMethods) {
  return Object.freeze({
    createOffer(offer: OfferEntity): Promise<OfferEntity> {
      logger.info('[Command] DbClient.createOffer');

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
      updateOffer: Offers.UpdateOfferType;
    }): Promise<OfferEntity> {
      logger.info('[Command] DbClient.updateOffer');

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
    async getPaginatedOffers(
      args: Offers.GetOffersRequestQuery,
    ): Promise<PaginationResponse<OfferEntity>> {
      logger.info('[Command] DbClient.getAllOffers');

      const { paginateCondition, whereCondition, page, perPage } =
        setPaginationParams<Offers.GetOffersRequestQuery>(args);

      const items = await db
        .query(
          sql`SELECT * FROM "offer" WHERE ${whereCondition} ORDER BY "offerId" ${paginateCondition}`,
        )
        .then(toMany(OfferEntity));

      return setPaginationResponse<OfferEntity>({
        items,
        perPage,
        page,
      });
    },
    getOfferById(offerId: OfferEntity['offerId']): Promise<OfferEntity | null> {
      logger.info('[Command] DbClient.getOfferById');

      return db
        .maybeOne(sql`SELECT * FROM "offer" WHERE "offerId"=${offerId}`)
        .then(toOptional(OfferEntity));
    },
    createOfferCategory(
      offer: OfferCategoryEntity,
    ): Promise<OfferCategoryEntity> {
      logger.info('[Command] DbClient.createOfferCategory');

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
      logger.info('[Command] DbClient.getAllOfferCategories');

      return db
        .query(sql`SELECT * FROM "offerCategory"`)
        .then(toMany(OfferCategoryEntity));
    },
  });
}

export function getOfferFilter() {}
