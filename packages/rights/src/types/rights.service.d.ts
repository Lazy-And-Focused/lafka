import { LAFka } from "../../node_modules/@lafka/types/dist";

export type RightsType<
  T extends (typeof LAFka.Rights.KEYS)[number],
  K extends T extends "default"
    ? keyof LAFka.Rights.LazyRights
    : string
> = K extends keyof LAFka.Rights.LazyRights
  ? (keyof LAFka.Rights.LazyRights[K])
  : (keyof (LAFka.Rights.Rights[T][keyof LAFka.Rights.Rights[T]]));

export type RightsTypeArray<
  T extends (typeof LAFka.Rights.KEYS)[number],
  K extends T extends "default"
    ? keyof LAFka.Rights.LazyRights
    : string
> = [RightsType<T, K>, ...RightsType<T, K>[]];

export declare abstract class LazyRightsService<
  T extends (typeof LAFka.Rights.KEYS)[number],
  K extends T extends "default"
    ? keyof LAFka.Rights.LazyRights
    : string = T extends "default"
      ? keyof LAFka.Rights.LazyRights
      : string
> {
  public constructor(rights: LAFka.Rights.Rights[T]);
  
  public has<Rights extends RightsTypeArray<T, K> = RightsTypeArray<T, K>>(data: {
    key: K extends keyof LAFka.Rights.LazyRights ? K : string,
    rights: Rights
  }): Record<Rights[number], boolean> | false;
}