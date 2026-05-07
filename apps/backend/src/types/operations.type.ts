import type { ApiOperationOptions } from "@nestjs/swagger";
import type { RoutesSettings, RoutesObject } from "./route-object.type";

export type Operations<T extends RoutesObject> = RoutesSettings<
  T,
  ApiOperationOptions
>;
