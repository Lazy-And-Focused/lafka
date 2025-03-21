import Database, { Constructors } from "database/models.database";

import { LAFka } from "lafka/types";

import type { CreateData, CreatePickData, Status as StatusType } from "lafka/types/mongodb.types";
import { Status, Error } from "lafka/types/status.classes";

import Post from "./post.class";

enum CreatePost {
  forum = "forum_posts",
  blog = "blog_posts",
  followed_forum = "followed_forum_posts",
  followed_blog = "followed_blog_posts",
  blocked = "blocked_posts"
}

type PostTypes = "forum" | "blog" | "followed_forum" | "followed_blog" | "blocked";
type Data = "username" | "nickname" | "biography" | "avatar" | "links";

class User<T extends boolean = false> implements LAFka.User {
  private _data: LAFka.User;
  private initialized: boolean = false;

  private readonly database = new Database();

  public constructor(data: Constructors.users<T>) {
    if (!data.username && !data.id) throw new Error("id and username is not defined");

    this._data = {
      id: "",
      username: "",
      created_at: new Date(),
      blocked_posts: [],
      blog_posts: [],
      followed_blog_posts: [],
      followed_forum_posts: [],
      followers: [],
      following: [],
      forum_posts: [],
      links: [],
      avatar: undefined,
      nickname: undefined,
      biography: undefined,
      ...data
    };
  }

  public readonly init = async (): Promise<T extends true ? this | null : this> => {
    if (this.initialized) return this;

    const data = this._data;
    const filter = !!data.id
      ? { id: data.id, username: data.username }
      : { username: data.username };

    const status: StatusType<LAFka.User[]> = await this.database.users.getData({
      filter: { ...filter }
    });

    if (status.type === 0 || !status.data) {
      if (filter.id && !filter.username) return null as any;

      const user = await this.database.users.create(data);
      this.initialized = true;

      return this.paste(data, user);
    } else {
      const user = status.data[0];
      const updateData = this.paste(data, user);

      this.database.users.update({
        filter: { username: data.username },
        update: {
          id: updateData._data.id,
          created_at: updateData._data.created_at,
          blocked_posts: updateData._data.blocked_posts,
          blog_posts: updateData._data.blog_posts,
          followed_blog_posts: updateData._data.followed_blog_posts,
          followed_forum_posts: updateData._data.followed_forum_posts,
          followers: updateData._data.followers,
          following: updateData._data.following,
          forum_posts: updateData._data.forum_posts,
          links: updateData._data.links,
          avatar: updateData._data.avatar,
          nickname: updateData._data.nickname,
          biography: updateData._data.biography
        }
      });
      this.initialized = true;

      return updateData;
    }
  };

  private readonly paste = (data: CreateData<LAFka.User>, user: LAFka.User) => {
    this._data = {
      ...data,
      ...user,

      id: user.id
    };

    return this;
  };

  private readonly getDatabaseUser = async (id?: string) => {
    const { data } = await this.database.users.getData({ filter: { id: id || this._data.id } });

    return data ? data[0] : null;
  };

  private async addPosts(posts: string[], type: PostTypes) {
    this._data[CreatePost[type]].push(...posts);

    return await this.database.users.push({
      filter: { id: this._data.id },
      update: { [CreatePost[type]]: posts }
    });
  }

  private async followController(
    following: string,
    action: "follow" | "unfollow"
  ): Promise<StatusType<any>> {
    const followingUser = await this.getDatabaseUser(following);
    const user = await this.getDatabaseUser();

    if (!followingUser || !user) return new Error("user not found");

    if (action === "follow") {
      followingUser.followers.push(this._data.id);
      user.following.push(following);
    } else {
      followingUser.followers = followingUser.followers.filter((id) => id !== this._data.id);
      user.following = user.following.filter((id) => id !== following);
    }

    this.database.users.update({
      filter: { id: followingUser.id },
      update: { followers: followingUser.followers }
    });

    this.database.users.update({
      filter: { id: user.id },
      update: { followers: user.following }
    });

    return new Status({ type: 1, text: action + "ing!" });
  }

  public static readonly delete = async (id: string) => {
    const db = new Database();
    const auth_user = await db.auth_users.delete({ filter: { profile_id: id } });
    const user = await db.users.delete({ id: id });

    return { auth_user, user };
  };

  public readonly delete = async (id?: string) => {
    return await User.delete(id || this._data.id);
  };

  public readonly updateData = async (data: string | LAFka.Link[], type: Data) => {
    if (typeof data === "string" && type !== "links") {
      this._data[type] === data;
      await this.database.users.update({
        filter: { id: this._data.id },
        update: { [type]: data }
      });
    } else if (Array.isArray(data) && type === "links") {
      this._data[type].push(...data);
      await this.database.users.push({
        filter: { id: this._data.id },
        update: { [type]: data }
      });
    } else {
      return new Error("type mismatch");
    }

    return new Status({ type: 1, text: type + " updated" });
  };

  public async createPost(
    post: CreatePickData<LAFka.BlogAndForumPost, "content" | "name" | "type">
  ) {
    const created = await new Post({ ...post, creator_id: this._data.id }).init();

    return {
      response: await this.addPosts([created.id], post.type),
      post: created
    };
  }

  public async follow(following: string) {
    return await this.followController(following, "follow");
  }

  public async unfollow(unfollowing: string) {
    return await this.followController(unfollowing, "unfollow");
  }

  public get id(): string {
    return this._data.id;
  }

  public get username(): string {
    return this._data.username;
  }

  public get nickname(): string | undefined {
    return this._data.nickname || undefined;
  }

  public get biography(): string {
    return this._data.biography || "";
  }

  public get links(): LAFka.Link[] {
    return this._data.links;
  }

  public get avatar(): string | undefined {
    return this._data.avatar;
  }

  public get created_at(): Date {
    return this._data.created_at;
  }

  public get forum_posts(): string[] {
    return this._data.forum_posts;
  }

  public get blog_posts(): string[] {
    return this._data.blog_posts;
  }

  public get followed_forum_posts(): string[] {
    return this._data.followed_forum_posts;
  }

  public get followed_blog_posts(): string[] {
    return this._data.followed_blog_posts;
  }

  public get blocked_posts(): string[] {
    return this._data.blocked_posts;
  }

  public get followers(): string[] {
    return this._data.followers;
  }

  public get following(): string[] {
    return this._data.following;
  }
}

export default User;
