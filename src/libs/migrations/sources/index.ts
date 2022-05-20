import { CommonQueryMethods } from 'slonik';

export type Migration = {
  migrationId?: string;
  run(db: CommonQueryMethods): Promise<void>;
};

import m0001 from './0001-recreate-schema';
import m0002 from './0002-add-users';
import m0003 from './0003-create-offers';
import m0004 from './0004-add-user-schedule';
import m0005 from './0005-create-offer-order';

export default [
  { migrationId: '0001-recreate-schema', ...m0001 },
  { migrationId: '0002-add-users', ...m0002 },
  { migrationId: '0003-create-offers', ...m0003 },
  { migrationId: '0004-add-user-schedule', ...m0004 },
  { migrationId: '0005-create-offer-order', ...m0005 },
];
