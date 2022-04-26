import { CommonQueryMethods } from 'slonik';

export type Migration = {
  migrationId?: string;
  run(db: CommonQueryMethods): Promise<void>;
};

import m0001 from './0001-recreate-schema';

export default [{ migrationId: '0001-recreate-schema', ...m0001 }];
