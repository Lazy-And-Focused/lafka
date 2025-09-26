import type { PostTag } from "@lafka/types";

import { createLazySchema, SchemaTypes } from "./schema";

export const Tag = createLazySchema<PostTag>({
  id: { type: SchemaTypes.String, required: true, unique: false },
  name: { type: SchemaTypes.String, required: true, unique: false },
});

export default Tag;
