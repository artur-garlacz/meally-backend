import { sql } from 'slonik';
import { Migration } from '.';

const migration: Migration = {
  async run(db) {
    await db.query(sql`
            CREATE TYPE "dayName" AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

            CREATE TABLE "userSchedule" (
                "userScheduleId" uuid PRIMARY KEY CHECK (
                    "userScheduleId" <> '00000000-0000-0000-0000-000000000000'
                ),
                "isMainSchedule"        boolean     DEFAULT false,
                "userScheduleName"      varchar(200),
                "scheduleId"            uuid NULL REFERENCES "userSchedule" ("userScheduleId"),
                "userId"                uuid NULL REFERENCES "user" ("userId")
            );

            CREATE UNIQUE INDEX user_schedule_single_main_schedule ON "userSchedule" ("userId") WHERE "isMainSchedule";

            CREATE TABLE "schedule" (
                "scheduleId" uuid PRIMARY KEY CHECK (
                    "scheduleId" <> '00000000-0000-0000-0000-000000000000'
                ),
                "day"               "dayName"    NOT NULL,
                "hourFrom"          time         NOT NULL CHECK ("hourFrom" < "hourTo"),
                "hourTo"            time         NOT NULL CHECK ("hourTo" > "hourFrom"),
                "userScheduleId"    uuid         NULL REFERENCES "userSchedule" ("userScheduleId"),
                CONSTRAINT          unique_user_schedule UNIQUE("day", "userScheduleId")
            );
      `);
  },
};

export default migration;
