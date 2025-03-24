import { LAFka } from "lafka/types";
import { Types } from "./types"; 
import { LazyRights } from "lafka/types/authors/rights.types";
import { RightsTypeArray } from "./types/rights.service";

export class LazyRightsService<
  T extends (typeof LAFka.Rights.KEYS)[number],
  K extends T extends "default"
    ? keyof LAFka.Rights.LazyRights
    : string = T extends "default"
      ? keyof LAFka.Rights.LazyRights
      : string
> extends Types.LazyRightsService<T, K> {
  public constructor(public readonly rights: LAFka.Rights.Rights[T]) {
    super(rights);
  }
  
  public has<Rights extends Types.RightsTypeArray<T, K> = Types.RightsTypeArray<T, K>>(data: {
    key: K extends keyof LAFka.Rights.LazyRights ? K : string,
    rights: Rights
  }) {
    const rights = Array.from(new Set(data.rights));

    if (rights.length === 0) return false;

    const existingRights = (this.rights as any)[data.key];

    return Object.fromEntries(rights.map((right) => {
      return existingRights[right] === 0
        ? [right, false]
        : [right, true];
    })) as Record<Rights[number], boolean>;
  }
};

class RightsService<
  T extends (typeof LAFka.Rights.KEYS)[number],
  K extends T extends "default"
    ? keyof LAFka.Rights.LazyRights
    : string = T extends "default"
      ? keyof LAFka.Rights.LazyRights
      : string
> extends Types.LazyRightsService<T, K> {
  public has<Rights extends RightsTypeArray<T, K> = RightsTypeArray<T, K>>(
    data: {
      key: K extends keyof LazyRights ? K : string;
      rights: Rights;
    }
  ): false | Record<Rights[number], boolean> {

  }
}





const d = new LazyRightsService<"default">(LAFka.Rights.DEFAULT_USER_RIGHTS).has({
  key: "ME",
  rights: ["ADMINISTRATOR"]
});

console.log(d);

const u = new LazyRightsService<"users">({"12345": LAFka.Rights.DEFAULT_USER_RIGHTS.USERS}).has({
  key: "12345",
  rights: ["MANAGE"]
});

console.log(u);

export default RightsService;
