import fs from 'fs';
import path from 'path';

const migrationFiles = fs.readdirSync(path.join(__dirname, 'sources'));

const migrations = migrationFiles
  .filter((filename) => filename.endsWith('.ts') && filename !== 'index.ts')
  .map((filename) => {
    const baseName = filename.replace(/.ts$/, '');

    const [sequence] = baseName.split('-');

    const varName = 'm' + sequence;
    const importName = filename.replace(/.ts$/, '');

    return {
      id: baseName,
      varName,
      sequence,
      importStatement: `import ${varName} from "./${importName}";`,
    };
  });

const toMigrationExport = (migration: { id: string; varName: string }) =>
  `{ migrationId: "${migration.id}", ...${migration.varName} },`;

fs.writeFileSync(
  path.join(__dirname, 'sources/index.ts'),
  `import { CommonQueryMethods } from "slonik";

export interface Migration {
  migrationId?: string;
  run(db: CommonQueryMethods): Promise<void>;
}

${migrations.map((m) => m.importStatement).join('\n')}

export default [
  ${migrations.map(toMigrationExport).join('\n  ')}
];
`,
);
