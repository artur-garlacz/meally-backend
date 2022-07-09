import { CommonQueryMethods } from 'slonik';

import m0001 from './0001-recreate-schema';
import m0002 from './0002-add-emails';

export type Migration = {
  migrationId?: string;
  run(db: CommonQueryMethods): Promise<void>;
};

export default [
  { migrationId: '0001-recreate-schema', ...m0001 },
  { migrationId: '0002-add-emails', ...m0002 },
];
