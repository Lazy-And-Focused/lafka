import Compiler from "fouter";

import { join } from "path";

new Compiler(__dirname, join(__dirname, "routes.ts")).execute();