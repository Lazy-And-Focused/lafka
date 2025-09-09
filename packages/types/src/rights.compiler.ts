import Compiler from "fbit-field/compiler";
import { Rights } from "./rights.types";

const rights = Object.fromEntries(
  Object.keys(Rights.CONSTANTS.object.available).map((key) => [
    key,
    Object.keys(Rights.CONSTANTS.object.available[key]),
  ]),
);

if (process.env.NODE_ENV === "rights_compile")
  new Compiler(
    rights,
    __dirname + "\\rights.types.ts",
    {},
    {
      writeInCompiler: true,
      defaultExportOn: false,
      name: "raw",
    },
  ).execute();