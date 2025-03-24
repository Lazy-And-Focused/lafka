import { Rights } from "../../node_modules/@lafka/types/dist";

import {
  LazyRightsService as ILazyRightsService,
  RightsType as IRightsType,
  RightsTypeArray as IRightsTypeArray
} from "./rights.service";

export declare namespace Types {
  export declare abstract class LazyRightsService<
    T extends Rights.RightsKeys,
    K extends T extends "default"
      ? keyof Rights.LazyRights
      : string = T extends "default"
        ? keyof Rights.LazyRights
        : string
  > extends ILazyRightsService<T, K> {};

  export type RightsType<
    T extends Rights.RightsKeys,
    K extends T extends "default"
      ? keyof Rights.LazyRights
      : string
  > = IRightsType<T, K>;
  
  export type RightsTypeArray<
    T extends Rights.RightsKeys,
    K extends T extends "default"
      ? keyof Rights.LazyRights
      : string
  > = IRightsTypeArray<T, K>;
}