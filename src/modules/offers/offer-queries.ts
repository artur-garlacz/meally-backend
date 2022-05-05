import { UpdateOfferType } from '@commons/api/offers';
import logger from '@libs/utils/logger';
import { chainOptionalUpdate, toMany } from '@libs/utils/query';
import { serializeDate } from '@libs/utils/serialization';
import { CommonQueryMethods, sql } from 'slonik';
import { OfferCategoryEntity, OfferEntity } from './entities';

export function getOffersWithParams() {}

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
      updateOffer,
    }: {
      offerId: OfferEntity['offerId'];
      updateOffer: UpdateOfferType;
    }): Promise<OfferEntity> {
      logger.debug('DbClient.updateOffer');

      return db.one(sql`
        UPDATE "offer"
        SET
        ${chainOptionalUpdate({
          title: updateOffer.title,
          unitPrice: updateOffer.unitPrice,
          longDesc: updateOffer.longDesc,
          shortDesc: updateOffer.shortDesc,
          status: updateOffer.status,
          availableQuantity: updateOffer.availableQuantity,
          promoted: updateOffer.promoted,
        })}
        WHERE "offerId" = ${offerId}
        RETURNING *`);
    },
    getAllOffers(): Promise<OfferEntity[]> {
      logger.debug('DbClient.getAllOffers');

      return db.query(sql`SELECT * FROM "offer"`).then(toMany(OfferEntity));
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
