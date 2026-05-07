import type { RoutesObject } from "@/types";
import { resolvePathname } from "./resolve-pathname.utils";

type ResolvePathnameParameters = Parameters<typeof resolvePathname>[0];

export const createEndpoints = <T extends RoutesObject>({
  routes,
  ...data
}: ResolvePathnameParameters & { routes: T }) => {
  const toUrl = resolvePathname(data);

  const endpoints = Object.fromEntries(
    Object.keys(routes).map((key) => {
      return [key, toUrl(routes[key])];
    }),
  ) as Record<keyof T, string>;

  return endpoints;
};
