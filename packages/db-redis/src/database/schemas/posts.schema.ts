import { Schema } from "redis-om";

import type { ForumPost } from "lafka/types/posts/forum-post.types";
import type { BlogPost } from "lafka/types/posts/blog-post.types";

const schema = new Schema<Readonly<ForumPost & BlogPost>>("posts", {
    id: { type: "string" },
    name: { type: "string" },
    content: { type: "string" },
    description: { type: "string" },
    comments: { type: "string[]" },
    followers: { type: "number" },
    created_at: { type: "date" },
    changed_at: { type: "date" },
    creator_id: { type: "string" },
    type: { type: "string" },
    view_status: { type: "number" },

    likes: { type: "number" },
    dislikes: { type: "number" },
    reposts: { type: "number" },

    tags: { type: "string[]" }, // JSON, type: Tag[] - id: string; name: Tags;
    status: { type: "string" }
}, {
    dataStructure: "JSON"
});

export default schema;