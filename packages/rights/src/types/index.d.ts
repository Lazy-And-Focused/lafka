import {
  LazyRightsService as ILazyRightsService,
  RightsType as IRightsType,
  RightsTypeArray as IRightsTypeArray
} from "./rights.service";

export declare namespace Types {
  export declare abstract class LazyRightsService<
    T extends (typeof LAFka.Rights.KEYS)[number],
    K extends T extends "default"
      ? keyof LAFka.Rights.LazyRights
      : string = T extends "default"
        ? keyof LAFka.Rights.LazyRights
        : string
  > extends ILazyRightsService<T, K> {};

  export type RightsType<
    T extends (typeof LAFka.Rights.KEYS)[number],
    K extends T extends "default"
      ? keyof LAFka.Rights.LazyRights
      : string
  > = IRightsType<T, K>;
  export type RightsTypeArray<
    T extends (typeof LAFka.Rights.KEYS)[number],
    K extends T extends "default"
      ? keyof LAFka.Rights.LazyRights
      : string
  > = IRightsTypeArray<T, K>;
}