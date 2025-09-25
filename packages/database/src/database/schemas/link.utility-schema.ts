import { Link as ILink } from "@lafka/types";

import { createLazySchema, SchemaTypes } from "./schema";

export const Link = createLazySchema<ILink>({
  name: { type: SchemaTypes.String, required: true, unique: false },
  url: { type: SchemaTypes.String, required: true, unique: false }
});

export default Link;

