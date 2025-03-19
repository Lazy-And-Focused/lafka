import { Link } from "./link.utility-schema";
import { Tag } from "./tag.utility-schema";

import AUDB, { AuthUsersSchema } from "./auth-user.schema";
import CDB, { CommentsSchema } from "./comments.schema";
import PDB, { PostsSchema } from "./posts.schema";
import UDB, { UserSchema } from "./user.schema";

export namespace Schemas {
    export const models = [
        "auth_users",
        "posts",
        "comments",
        "users"
    ] as const;
    
    export const modelKeys = {
        auth_users: ["id", "service_id", "created_at", "profile_id", "access_token", "refresh_token", "type"],
        posts: ["id", "name", "content", "description", "comments", "followers", "created_at", "changed_at", "creator_id", "type", "view_status", "likes", "dislikes", "reposts", "tags", "status"],
        comments: ["id", "content", "created_at", "changed_at", "author_id", "post_id", "reply"],
        users: ["id", "username", "nickname", "avatar", "biography", "created_at", "blocked_posts", "blog_posts", "forum_posts", "followed_blog_posts", "followed_forum_posts", "followers", "links"],
    } as const;

    export type Models = typeof models[number];

    export const databases = {
        auth_users: AUDB,
        comments: CDB,
        posts: PDB,
        users: UDB
    } as const;

    export const utility = {
        link: Link,
        tag: Tag
    } as const;

    export const schemas = {
        auth_users: AuthUsersSchema,
        comments: CommentsSchema,
        posts: PostsSchema,
        users: UserSchema
    } as const;
}