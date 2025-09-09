import Database, { Constructors } from "database/models.database";

import { LAFka } from "lafka/types";
import { Helpers } from "./helpers";

class Comment implements LAFka.Comment {
  private readonly database = new Database();

  private initialized: boolean = false;
  private data: LAFka.Comment;

  public constructor(data: Constructors.comments) {
    const now = new Date().toISOString();

    this.data = {
      id: "",
      created_at: data.created_at || now,
      author_id: data.author_id,
      content: data.content,
      post_id: data.post_id,
      reply: data.reply || undefined,
    };
  }

  public init = async () => {
    if (this.initialized) return this;
    const commentData = this.data;

    const create = async () => {
      if (this.initialized) return this;

      this.initialized = true;

      const createdComment = await this.database.comments.create({
        ...commentData,
        changed_at: undefined
      });

      return this.paste(commentData, createdComment);
    };

    if (commentData.id) {
      const foundComment = await this.database.comments.model.findOne({ id: commentData.id });

      if (foundComment) {
        this.initialized = true;
        return this.paste(commentData, foundComment);
      }
    }

    await create();

    return this;
  };

  private paste(data: Constructors.comments & { created_at: string }, comment: LAFka.Comment) {
    this.data = Helpers.parse({
      ...data,
      ...comment,

      id: comment.id
    }, "comments");

    return this;
  }

  private changed() {
    this.data.changed_at = new Date().toISOString();
  }

  public set content(content: string) {
    this.changed();

    this.data.content = content;
  }

  public get id(): string {
    return this.data.id;
  }

  public get content(): string {
    return this.data.content;
  }

  public get created_at(): string {
    return this.data.created_at;
  }

  public get author_id(): string {
    return this.data.author_id;
  }

  public get post_id(): string {
    return this.data.post_id;
  }

  public get reply(): string | undefined {
    return this.data.reply;
  }

  public get changed_at(): string | undefined {
    return this.data.changed_at;
  }
}

export default Comment;
