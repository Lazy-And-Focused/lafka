import { Schema } from "redis-om";
import { User } from "lafka/types/authors/user.types"

const schema = new Schema<Readonly<User>>("users", {
    id: { type: "string" },
    username: { type: "string" },
    nickname: { type: "string" },
    avatar: { type: "string" },
    biography: { type: "string" },
    links: { type: "string[]" }, // JSON, type: Link[] - { name: string; link: string; }
    created_at: { type: "date" },
    forum_posts: { type: "string[]" },
    blog_posts: { type: "string[]" },
    followed_forum_posts: { type: "string[]" },
    followed_blog_posts: { type: "string[]" },
    blocked_posts: { type: "string[]" },
    followers: { type: "string[]" },
    following: { type: "string[]" },
}, {
    dataStructure: "JSON"
});

export default schema;