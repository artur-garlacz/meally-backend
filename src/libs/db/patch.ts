// tslint:disable-next-line
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pgParse = require('pg-connection-string');

export function patchCreatePoolConfig() {
  const parse = pgParse.parse;

  pgParse.parse = (arg: string | object) => {
    if (typeof arg === 'string') {
      return parse(arg);
    }
    return arg;
  };
}
