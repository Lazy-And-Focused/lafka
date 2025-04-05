import Database, { Constructors } from "database/models.database";

import { LAFka, Rights } from "lafka/types";

import type { CreateData, PickCreateData, Status as StatusType } from "lafka/types/mongodb.types";
import { Status, Error } from "lafka/types/status.classes";

import Post from "./post.class";

import { Helpers } from "./helpers";

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
  private readonly database = new Database();
  
  private data: LAFka.User;
  private initialized: boolean = false;

  public constructor(data: Constructors.users<T>) {
    if (!data.username && !data.id) throw new Error("id and username is not defined");

    this.data = {
      id: "",
      username: data.username || "",
      created_at: data.created_at || new Date(),
      blocked_posts: data.blocked_posts || [],
      blog_posts: data.blog_posts || [],
      followed_blog_posts: data.followed_blog_posts || [],
      followed_forum_posts: data.followed_forum_posts || [],
      followers: data.followers || [],
      following: data.following || [],
      forum_posts: data.forum_posts || [],
      links: data.links || [],
      avatar: data.avatar || undefined,
      nickname: data.nickname || undefined,
      biography: data.biography || undefined,
      rights: data.rights || {
        me: `${Rights.Raw.Default.ME}`,
        users: []
      },
    };
  }

  public async init(): Promise<T extends true ? this | null : this> {
    if (this.initialized) return this;

    const userData = this.data;
    const filter = !!userData.id
      ? { id: userData.id, username: userData.username }
      : { username: userData.username };

    const gettedUser: StatusType<LAFka.User[]> = await this.database.users.getData({
      filter: { ...filter }
    });

    if (!gettedUser.successed || !gettedUser.data) {
      if (filter.id && !filter.username) return null as any;

      const user = await this.database.users.create(userData);
      this.initialized = true;

      return this.paste(userData, user);
    } else {
      const user = gettedUser.data[0];
      const updateData = this.paste(userData, user);

      this.database.users.update({
        filter: { username: userData.username },
        update: Helpers.parse(updateData.data, "users")
      });
      this.initialized = true;

      return updateData;
    }
  };

  public static async delete(id: string)  {
    const db = new Database();
    const auth_user = await db.auth_users.delete({ filter: { profile_id: id } });
    const user = await db.users.delete({ id: id });

    return { auth_user, user };
  };

  public async delete(id?: string) {
    return await User.delete(id || this.data.id);
  };

  public async updateData(data: string | LAFka.Link[], type: Data) {
    if (typeof data === "string" && type !== "links") {
      this.data[type] === data;
      
      await this.database.users.update({
        filter: { id: this.data.id },
        update: { [type]: data }
      });
    } else if (Array.isArray(data) && type === "links") {
      this.data[type].push(...data);

      await this.database.users.push({
        filter: { id: this.data.id },
        update: { [type]: data }
      });
    } else {
      return new Error("type mismatch");
    }

    return new Status({ successed: true, text: type + " updated", data: type + " updated", error: undefined });
  };

  public async createPost(
    post: PickCreateData<LAFka.LazyPost, "content" | "name" | "type">
  ) {
    const created = await new Post({ ...post, creator_id: this.data.id }).init();

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
    return this.data.id;
  }

  public get username(): string {
    return this.data.username;
  }

  public get nickname(): string | undefined {
    return this.data.nickname || undefined;
  }

  public get biography(): string {
    return this.data.biography || "";
  }

  public get links(): LAFka.Link[] {
    return this.data.links;
  }

  public get avatar(): string | undefined {
    return this.data.avatar;
  }

  public get created_at(): Date {
    return this.data.created_at;
  }

  public get forum_posts(): string[] {
    return this.data.forum_posts;
  }

  public get blog_posts(): string[] {
    return this.data.blog_posts;
  }

  public get followed_forum_posts(): string[] {
    return this.data.followed_forum_posts;
  }

  public get followed_blog_posts(): string[] {
    return this.data.followed_blog_posts;
  }

  public get blocked_posts(): string[] {
    return this.data.blocked_posts;
  }

  public get followers(): string[] {
    return this.data.followers;
  }

  public get following(): string[] {
    return this.data.following;
  }

  public get rights(): Rights.Raw.Rights["user"] {
    return this.data.rights;
  }

  private readonly paste = (data: CreateData<LAFka.User>, user: LAFka.User) => {
    this.data = Helpers.parse<LAFka.User>({
      ...data,
      ...user,

      id: user.id
    }, "users");

    return this;
  };

  private readonly getDatabaseUser = async (id?: string) => {
    const { data } = await this.database.users.getData({ filter: { id: id || this.data.id } });

    return data ? data[0] : null;
  };

  private async addPosts(posts: string[], type: PostTypes) {
    this.data[CreatePost[type]].push(...posts);

    return await this.database.users.push({
      filter: { id: this.data.id },
      update: { [CreatePost[type]]: posts }
    });
  }

  private async followController(
    following: string,
    action: "follow" | "unfollow"
  ): Promise<StatusType<any, any, boolean>> {
    const followingUser = await this.getDatabaseUser(following);
    const user = await this.getDatabaseUser();

    if (!followingUser || !user) return new Error("user not found");

    if (action === "follow") {
      followingUser.followers.push(this.data.id);
      user.following.push(following);
    } else {
      followingUser.followers = followingUser.followers.filter((id) => id !== this.data.id);
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

    return new Status({ successed: true, text: action + "ing!", data: action + "ing!", error: undefined });
  }
}

export default User;
