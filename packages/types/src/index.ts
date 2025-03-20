import {
    authTypes as authTypesC,
    AuthTypes as AuthTypesT,
    AuthUser as AuthUserT,
    AUKeys as CAUKeys
} from "./auth/auth-user.types";
import {
    BlogPost as BlogPostT,
    BPKeys as CBPKeys,
} from "./posts/blog-post.types";
import {
    Comment as CommentT,
    CKeys as CCKeys,
} from "./content/comment.types";
import {
    ForumPost as ForumPostT,
    PFKeys as CPFKeys,
} from "./posts/forum-post.types";
import {
    Post as PostT,
    PKeys as CPKeys,
} from "./posts/post.types";
import {
    User as UserT,
    UKeys as CUKeys,
} from "./authors/user.types";

import { Link as LinkT, PostStatus as PostStatusT, Tag as TagT, Tags as TagsT } from "./utility/utility.types";

export namespace LAFka {
    export const authTypes = authTypesC;

    export const keys = {
        auth_users: CAUKeys,
        posts: [...CPKeys, ...CPFKeys, ...CBPKeys],
        comments: CCKeys,
        users: CUKeys,
        
        blog_posts: CBPKeys,
        forum_posts: CPFKeys,
    } as const;

    export type AuthTypes = AuthTypesT;
    export type AuthUser = AuthUserT;

    export type User = UserT;
    
    export type Comment = CommentT;

    export type BlogPost = BlogPostT;
    export type ForumPost = ForumPostT;
    export type Post = PostT;
    export type BlogAndForumPost = BlogPostT & ForumPostT;

    export type Link = LinkT;
    export type PostStatus = PostStatusT;
    export type Tag = TagT;
    export type Tags = TagsT;
}