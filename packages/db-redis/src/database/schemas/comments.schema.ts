import { Schema } from "redis-om";
import type { Comment } from "lafka/types/content/comment.types";

const schema = new Schema<Readonly<Comment>>("comments", {
    id: { type: "string" },
    content: { type: "string" },
    created_at: { type: "date" },
    changed_at: { type: "date" },
    author_id: { type: "string" },
    post_id: { type: "string" },
    reply: { type: "string" }
}, {
    dataStructure: "JSON"
});

export default schema;