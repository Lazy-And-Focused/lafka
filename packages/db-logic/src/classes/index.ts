import authUserClass from "../classes/auth-user.class";
import commentClass from "../classes/comment.class";
import postClass from "./post.class";
import userClass from "../classes/user.class";

import DatabaseClass, { DatabaseType as DatabaseTypeT } from "./database.class";

export namespace Classes {
    export class Auth_user extends authUserClass {};
    export class Comment extends commentClass {};
    export class Post extends postClass {};
    export class User<T extends boolean = false> extends userClass<T> {};

    export class Database<T extends { id: string }, K = Partial<T>> extends DatabaseClass<T, K> {};
    export type DatabaseType<T extends { id: string }, K = Partial<T>> = DatabaseTypeT<T, K>;
}