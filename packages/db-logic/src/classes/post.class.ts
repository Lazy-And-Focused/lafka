import Database, { Constructors } from "../database/models.database";

import { LAFka } from "lafka/types";

import type { CreateData, PickCreateData } from "lafka/types/mongodb.types";

import Comment from "./comment.class";
import { Helpers } from "./helpers";

class Post implements LAFka.Post {
  private readonly database = new Database();

  private data: LAFka.BlogAndForumPost;
  private initialized: boolean = false;

  public constructor(data: Constructors.posts) {
    this.data = {
      id: "",
      created_at: data.created_at || new Date(),

      content: data.content,
      creator_id: data.creator_id,
      name: data.name,
      type: data.type,

      likes: data.likes || 0,
      dislikes: data.dislikes || 0,
      reposts: data.reposts || 0,

      followers: data.followers || 0,
      comments: data.comments || [],

      view_status: data.view_status || 1,

      tags: data.tags || [],
      status: data.status || "open"
    };
  }

  public readonly init = async () => {
    if (this.initialized) return this;

    const postData = this.data;

    const create = async () => {
      if (this.initialized) return this;
      this.initialized = true;

      const post = await this.database.posts.create(postData);

      return this.paste(postData, post);
    };

    if (postData.id) {
      const { data: gettedPost } = await this.database.posts.getData({
        filter: { id: postData.id }
      });

      if (gettedPost) {
        this.initialized = true;
        return this.paste(postData, gettedPost[0]);
      }
    }

    await create();

    return this;
  };

  public async createComment(comment: PickCreateData<LAFka.Comment, "author_id" | "content">) {
    const created = await new Comment({
      post_id: this.data.id,
      ...comment
    }).init();

    return {
      response: this.addComments([created.id]),
      comment: created
    };
  }

  public readonly addTags = async (tags: LAFka.Tag[]) => {
    if (this.data.type !== "forum") return "this is a blog post";

    this.data.tags.push(...tags);

    return await this.database.posts.push({
      filter: { id: this.data.id },
      update: { tags: tags }
    });
  };

  public addLikes = async (likes: number) => {
    if (this.data.type != "blog") return "this is a forum posts";

    this.data.likes += likes;

    return await this.database.posts.update({
      filter: { id: this.data.id },
      update: { likes: this.data.likes }
    });
  };

  public addDislikes = async (dislikes: number) => {
    if (this.data.type != "blog") return "this is a forum posts";

    this.data.dislikes += dislikes;

    return await this.database.posts.update({
      filter: { id: this.data.id },
      update: { dislikes: this.data.dislikes }
    });
  };

  public addReposts = async (reposts: number) => {
    if (this.data.type != "blog") return "this is a forum posts";

    this.data.reposts += reposts;

    return await this.database.posts.update({
      filter: { id: this.data.id },
      update: { reposts: this.data.reposts }
    });
  };

  public set name(data: string) {
    this.changed();

    this.data.name = data;
  }

  public set content(data: string) {
    this.changed();

    this.data.content = data;
  }

  public set description(data: string) {
    this.changed();

    this.data.description = data;
  }

  public set followers(followers: number) {
    this.data.followers = followers;
  }

  public get id(): string {
    return this.data.id;
  }

  public get created_at() {
    return this.data.created_at;
  }

  public get changed_at() {
    return this.data.changed_at;
  }

  public get creator_id() {
    return this.data.creator_id;
  }

  public get view_status() {
    return this.data.view_status;
  }

  public get name(): string {
    return this.data.name;
  }

  public get content(): string {
    return this.data.content;
  }

  public get description(): string | undefined {
    return this.data.description;
  }

  public get comments(): string[] {
    return this.data.comments;
  }

  public get followers(): number {
    return this.data.followers;
  }

  public get createdAt(): Date {
    return this.data.created_at;
  }

  public get changedAt(): Date | undefined {
    return this.data.changed_at;
  }

  public get type(): "forum" | "blog" {
    return this.data.type;
  }

  public get likes(): number {
    if (this.data.type != "blog") return 0;

    return this.data.likes;
  }

  public get dislikes(): number {
    if (this.data.type != "blog") return 0;

    return this.data.dislikes;
  }

  public get reposts(): number {
    if (this.data.type != "blog") return 0;

    return this.data.reposts;
  }

  public get tags(): LAFka.Tag[] {
    if (this.data.type != "forum") return [];

    return this.data.tags;
  }

  public get status(): LAFka.PostStatus {
    if (this.data.type !== "forum") return "blocked";

    return this.data.status;
  }

  private readonly paste = (
    data: CreateData<LAFka.BlogAndForumPost> & { id?: string },
    post: LAFka.BlogAndForumPost
  ) => {
    this.data = Helpers.parse<LAFka.BlogAndForumPost>({
      ...data,
      ...post,

      id: post.id
    }, "posts");

    return this;
  };

  private readonly changed = () => {
    this.data.changed_at = new Date();
  };

  private readonly addComments = async (comments: string[]) => {
    this.data.comments.push(...comments);

    return await this.database.posts.push({
      filter: { id: this.data.id },
      update: { comments: comments }
    });
  };
}

export default Post;
