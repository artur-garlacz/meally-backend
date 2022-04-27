import { CommonQueryMethods } from 'slonik';

export type Migration = {
  migrationId?: string;
  run(db: CommonQueryMethods): Promise<void>;
};

import m0001 from './0001-recreate-schema';
import m0002 from './0002-add-users';

export default [
  { migrationId: '0001-recreate-schema', ...m0001 },
  { migrationId: '0002-add-users', ...m0002 },
];
