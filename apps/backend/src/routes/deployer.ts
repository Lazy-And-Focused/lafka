import { join, parse } from "path";
import { readdirSync } from "fs";

const EXTENSION = parse(__filename).ext;
const FILE_FORMAT = new RegExp("[\\w\\W]+\\.module\\" + EXTENSION, "g");

export class Deployer {
  public execute(filesPath = __dirname, data = []) {
    const files = readdirSync(filesPath);

    for (const folder of files) {
      try {
        this.execute(join(filesPath, folder), data);
      } catch {
        if (!FILE_FORMAT.test(folder)) continue;

        const module = require(join(filesPath, folder)).default;

        data.push(module);
      }
    }

    return data;
  }
}

export default Deployer;
