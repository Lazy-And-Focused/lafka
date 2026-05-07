import type { Path } from "@/types";

const resolvePathToString = (path: Path) => {
  return Array.isArray(path) ? path[0] : path;
};

export const resolvePathname = ({
  version,
  route,
}: {
  version: string;
  route: Path;
}) => {
  const resolvedRoute = resolvePathToString(route);
  return (path: Path) => {
    const resolvedPath = resolvePathToString(path);
    return `/${version}/${resolvedRoute}${resolvedPath}`;
  };
};
