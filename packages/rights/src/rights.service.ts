import { LAFka } from "lafka/types";

type RightsType<
  T extends (typeof LAFka.Rights.KEYS)[number],
  K extends T extends "default"
    ? keyof LAFka.Rights.LazyRights
    : string
> = K extends keyof LAFka.Rights.LazyRights
  ? (keyof LAFka.Rights.LazyRights[K])
  : (keyof (LAFka.Rights.Rights[T][keyof LAFka.Rights.Rights[T]]));

type RightsTypeArray<
  T extends (typeof LAFka.Rights.KEYS)[number],
  K extends T extends "default"
    ? keyof LAFka.Rights.LazyRights
    : string
> = [RightsType<T, K>, ...RightsType<T, K>[]];

class RightsService<
  T extends (typeof LAFka.Rights.KEYS)[number],
  K extends T extends "default"
    ? keyof LAFka.Rights.LazyRights
    : string = T extends "default"
      ? keyof LAFka.Rights.LazyRights
      : string
> {
  public constructor(public readonly rights: LAFka.Rights.Rights[T]) {}
  
  public has<Rights extends RightsTypeArray<T, K> = RightsTypeArray<T, K>>(data: {
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
    })) as Record<(typeof data.rights)[number], boolean>;
  }
};

const d = new RightsService<"default">(LAFka.Rights.DEFAULT_USER_RIGHTS).has({
  key: "ME",
  rights: ["ADMINISTRATOR"]
});

console.log(d);

const u = new RightsService<"users">({"12345": LAFka.Rights.DEFAULT_USER_RIGHTS.USERS}).has({
  key: "12345",
  rights: ["MANAGE"]
});

console.log(u);

export default RightsService;
