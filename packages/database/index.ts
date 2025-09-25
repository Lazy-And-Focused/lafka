import connect from "./src/database/index.database";
import MODELS from "./src/database";

import schemas from "./src/database/schemas";
import Model from "./src/database/model";

export { Helpers } from "./src/database";
export * from "./src/database/schemas";

export { connect, MODELS, Model, schemas };

export default MODELS;