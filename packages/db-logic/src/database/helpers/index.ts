import deleteModelHelper from "./delete-model.helper"
import getAllModelsHelper from "./get-all-models.helper"
import getDataHelper from "./get-data.helper"
import parseHelper from "./parse.helper"

export namespace Helpers {
  export const deleteModel = deleteModelHelper;
  export const getAllModels = getAllModelsHelper;
  export const getData = getDataHelper;
  export const parse = parseHelper;
}