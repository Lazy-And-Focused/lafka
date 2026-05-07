import type { ArrayPath, Operations, Path, RoutesObject } from "@/types";

type GroupedRoutes<T extends RoutesObject> = {
  [P in keyof T]: T[P] extends Readonly<ArrayPath> ? ArrayPath : T[P];
};

type ConstructorData<R extends RoutesObject, P extends Path> = {
  route: P;
  routes: R;
  operations: Operations<R>;
};

export class Routes<const R extends RoutesObject, const P extends Path> {
  public constructor(private readonly data: ConstructorData<R, P>) {}

  public execute() {
    return {
      ROUTE: this.data.route,
      ROUTES: this.data.routes as GroupedRoutes<R>,
      OPERATIONS: this.data.operations,
    } as const;
  }
}

export default Routes;
