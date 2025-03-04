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