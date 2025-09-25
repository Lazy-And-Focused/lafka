import type { Models as ModelsNames, Schemas } from "./schemas";
import { schemas } from "./schemas";

import Model from "./model";

export { Helpers } from "./helpers";

export type Models = {
  [P in ModelsNames]: Model<Schemas[P]["database"]>
}

export const MODELS = Object.fromEntries(
  Object.keys(schemas).map(key =>
    [key, new Model(schemas[key].database)]
)) as Models; 

export default MODELS;
