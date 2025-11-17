import Compiler from "fouter";

import { join } from "path";

const compiler = new Compiler(
  join(__dirname, "endpoints"),
  join(__dirname, "routes.ts"),
);
const data = compiler.execute(false);

const COMPILED_OVERWRRITE_TEXT = `// FOUTER__COMPILED__OVERWRITE_THIS \\\\`;

const routes = JSON.stringify(
  Object.fromEntries(
    data.map((route) => {
      return [
        `'${route.parent}'`,
        Object.fromEntries(
          data
            .filter((r) => r.parent === route.parent)
            .map((r) => [
              `'${r.method} ${r.path}'`,
              <typeof r>{
                ...r,
                method: `'${r.method}'`,
                parent: `'${r.parent}'`,
                path: `'${r.path}'`,
              },
            ]),
        ),
      ];
    }),
  ),
  undefined,
  2,
)
  .replaceAll('"', "")
  .replaceAll("'", '"')
  .replaceAll("},\n", "},\n\n");

const text = `${COMPILED_OVERWRRITE_TEXT}\n\nexport type Routes = ${routes}\n\n${COMPILED_OVERWRRITE_TEXT}`;

compiler.write(false)(text);
