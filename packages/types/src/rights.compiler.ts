import Compiler from 'fbit-field/compiler';
import { Rights } from './rights.types';

import { join } from 'path';

const rights = Object.fromEntries(
  Object.keys(Rights.CONSTANTS.object.available).map((key) => [
    key,
    Object.keys(Rights.CONSTANTS.object.available[key]),
  ]),
);

new Compiler(
  rights,
  join(__dirname, 'rights.types.ts'),
  {},
  {
    writeInCompiler: true,
    defaultExportOn: false,
    name: 'raw',
  },
).execute();
