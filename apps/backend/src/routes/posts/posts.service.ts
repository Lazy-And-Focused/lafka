import { Injectable } from "@nestjs/common";

import { Constructors } from "lafka/database/database";
import { Models } from "lafka/database";
import { Rights } from "@lafka/rights";

import { UpdateWriteOpResult } from "mongoose";
import { DeleteResult } from "mongodb";
import { Comment, CreateComment, LazyPost, Response, User } from "lafka/types";

const { posts, users, comments } = new Models();

const FILTER = {
  offset: 0,
  count: 0,
  sortBy: ["likes", "dislikes", "followers", "created_at", "changed_at"],
  sortType: ["asc", "desc", 1, -1, true, false]
};

const REQUIRED_DATA_TO_CREATE_POST = [
  "content",
  "creator_id",
  "name",
  "type"
];

export type Filter = {
  offset: number,
  count: number,
  sortBy: "likes"|"dislikes"|"followers"|"created_at"|"changed_at",
  sortType: 1 | -1
}

@Injectable()
export class PostsService {
  public async getPosts(rawFilter: Record<string, string>): Promise<Response<LazyPost[]>> {
    const filter = this.parseFilter({
      count: "0",
      offset: "0",
      sortBy: "created_at",
      sortType: "desc",
      ...rawFilter
    });

    const data = (await posts.getData({filter: {}, options: {
      limit: filter.count,
      skip: filter.offset,
      sort: { [filter.sortBy]: filter.sortType }
    }}));

    if (!data.successed || !data.data) return { successed: false, data: null, error: data.text };
    if (data.data.length === 0) return { successed: false, data: null, error: "Posts not found" };

    return {
      successed: true,
      data: data.data.map(p => p.toObject()),
      error: null
    }
  }

  public async getPost(id: string): Promise<Response<LazyPost>> {
    const data = await posts.getData({filter: {id}});
    
    if (!data.successed || !data.data || data.data.length === 0)
      return { successed: false, data: null, error: "Post not found" };
  
    return {
      successed: true,
      data: data.data[0],
      error: null
    };
  }

  public async createPost(userId: string, post: Constructors.posts): Promise<Response<LazyPost>> {
    const user = (await users.getData({filter: {id: userId}})).data;

    if (!user || !user[0]) return { successed: false, data: null, error: "User not found"};

    if (!new Rights.UserService(user[0]).has("POSTS_CREATE"))
      return { successed: false, data: null, error: "403 Forbidenn" };

    for (const required of REQUIRED_DATA_TO_CREATE_POST) {
      if (!Object.keys({...post, creator_id: userId}).includes(required)) {
        return {
          successed: false,
          error: "there is no required data",
          data: null
        };
      }
    }

    return {
      successed: true,
      data: (await posts.create({...post, creator_id: userId})).toObject(),
      error: null,
    };
  }

  public async putPost(post: Partial<LazyPost> & { id: string }): Promise<Response<UpdateWriteOpResult>> {
    const data = await posts.update({
      filter: { id: post.id },
      update: {
        ...post
      }
    });

    return { successed: true, error: null, data: data };
  }
  
  public async blockPost(userId: string, postId: string): Promise<Response<User>> {
    const data = await this.patchService("block", { id: postId }, userId);

    return { successed: true, error: null, data };
  };

  public async followPost(userId: string, postId: string, type: "blog"|"forum"): Promise<Response<User>> {
    const data = await this.patchService("follow", { id: postId, type }, userId);

    return { successed: true, error: null, data };
  };

  public async deletePost(userId: string, postId: string): Promise<Response<DeleteResult>> {
    const post = (await posts.model.findById(postId)).toObject();
  
    const isCreator = post.creator_id === userId;

    if (!isCreator) {
      return { successed: false, data: null, error: "User is not a creator." }
    };

    const data = await posts.delete({ id: postId });

    return { successed: true, error: null, data: data };
  }

  public async postComment(comment: CreateComment): Promise<Response<Comment>> {
    try {
      const data = (await comments.create({
        ...comment,
        created_at: new Date().toISOString()
      })).toObject();

      await posts.update({
        filter: { id: comment.post_id },
        update: {
          $push: {
            comments:data.id
          }
        }
      });

      return { 
        successed: true,
        error: null,
        data
      }
    } catch (error) {
      return { successed: false, data: null, error };
    }
  }

  public async getComments(postId: string): Promise<Response<string[]>> {
    try {
      const data = (await posts.model.findOne({id: postId})).comments;

      return {
        successed: true,
        data,
        error: null
      }
    } catch (error) {
      return { successed: false, error, data: null };
    }
  }

  private async patchService<T extends "block"|"follow">(
    type: T,
    post: T extends "follow"
      ? { id: string, type: "blog"|"forum" }
      : { id: string, type?: undefined },
    userId: string
  ) {
    const key = this.resolvePostKey(type, post);

    const includes = (await users.model.findOne({id: userId}))[key].includes(post.id);

    return (await users.model.findOneAndUpdate({
      id: userId
    }, includes ? {
      $pull: {
        [key]: post.id
      }
    } : {
      $push: {
        [key]: post.id
      }
    }, {
      returnDocument: "after"
    })).toObject();
  }
  
  private resolvePostKey<T extends "block"|"follow">(
    type: T,
    post: T extends "follow"
      ? { type: "blog"|"forum" }
      : { type?: undefined }
  ) {
    if (type === "block") {
      return "blocked_posts" as const;
    } else {
      return post.type === "blog"
        ? "followed_blog_posts" as const
        : "followed_forun_posts" as const;
    }
  }

  private parseFilter(data: Record<keyof Filter, string>): Filter {
    return {
      count: Number(data.count),
      offset: Number(data.offset),
      sortBy: FILTER.sortBy.includes(data.sortBy) ? data.sortBy as Filter["sortBy"] : "created_at",
      sortType: typeof data.sortType === "boolean"
        ? data.sortType === true
          ? 1
          : -1
        : typeof data.sortType === "number"
          ? data.sortType === 1
            ? 1
            : -1
          : typeof data.sortType === "string"
            ? data.sortType === "asc"
              ? 1
              : -1
            : -1
    };
  }
}