import { Repository, RedisClientConnection } from "redis-om";

import type { ForumPost } from "lafka/types/posts/forum-post.types";
import type { BlogPost } from "lafka/types/posts/blog-post.types";
import type { Comment } from "lafka/types/content/comment.types";
import type { User } from "lafka/types/authors/user.types";

import userSchema from "./schemas/user.schema";
import commentsSchema from "./schemas/comments.schema";
import postsSchema from "./schemas/posts.schema";

class Redis {
    private readonly _users: Repository<Readonly<User>>;
    private readonly _comments: Repository<Readonly<Comment>>;
    private readonly _posts: Repository<Readonly<BlogPost&ForumPost>>;

    public constructor(redis: RedisClientConnection) {
        this._users = new Repository(userSchema, redis);
        this._comments = new Repository(commentsSchema, redis);
        this._posts = new Repository(postsSchema, redis);
    }

    get posts() {
        return this._posts;
    }
    
    get comments() {
        return this._comments;
    }

    get users() {
        return this._users;
    }
}

export default Redis;