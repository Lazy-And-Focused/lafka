import { name, version } from "../../package.json";

type AppInfoType = {
  name: string;
  version: string;
};

const appInfo: AppInfoType = {
  name: name.toUpperCase(),
  version,
};

export type { AppInfoType };
export default appInfo;
