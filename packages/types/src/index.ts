import { User as UserT } from "./authors/user.types";
import { Comment as CommentT } from "./content/comment.types";
import { BlogPost as BlogPostT } from "./posts/blog-post.types";
import { ForumPost as ForumPostT } from "./posts/forum-post.types";
import { Post as PostT } from "./posts/post.types";
import { Link as LinkT, PostStatus as PostStatusT, Tag as TagT, Tags as TagsT } from "./utility/utility.types";
import { authTypes as authTypesC, AuthTypes as AuthTypesT, AuthUser as AuthUserT } from "./auth/auth-user.types";

export namespace LAFka {
    export const authTypes = authTypesC;

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