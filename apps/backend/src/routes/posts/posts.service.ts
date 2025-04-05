import { Injectable } from "@nestjs/common";

import { Constructors } from "lafka/database/database/models.database";
import DB, { Models } from "lafka/database";
import { LAFka, Rights as RightsTypes } from "lafka/types";
import { Rights } from "@lafka/rights";

import { ServiceResponse } from "lafka/types/service.types";

const { posts, users } = new Models();

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
  public async getPosts(rawFilter: Record<string, string>): Promise<ServiceResponse<LAFka.LazyPost[]>> {
    const filter = this.parseFilter({
      count: "0",
      offset: "0",
      sortBy: "created_at",
      sortType: "desc",
      ...rawFilter
    });

    const data = await posts.getData({filter: {}, options: {
      limit: filter.count,
      skip: filter.offset,
      sort: { [filter.sortBy]: filter.sortType }
    }});

    if (!data.successed || !data.data) return { successed: false, resource: null, error: data.text };
    if (data.data.length === 0) return { successed: false, resource: null, error: "Posts not found" };

    return {
      successed: true,
      resource: data.data.map(p => DB.Database.parse(p, "posts")),
      error: null
    }
  }

  public async getPost(id: string): Promise<ServiceResponse<LAFka.LazyPost>> {
    const data = await posts.getData({filter: {id}});
    
    if (!data.successed || !data.data || data.data.length === 0)
      return { successed: false, resource: null, error: "Post not found" };
  
    return {
      successed: true,
      resource: data.data[0],
      error: null
    };
  }

  public async createPost(userId: string, post: Constructors.posts): Promise<ServiceResponse<LAFka.LazyPost>> {
    const user = (await users.getData({filter: {id: userId}})).data;

    if (!user || !user[0]) return { successed: false, resource: null, error: "User not found"};

    if (!new Rights.UserService(user[0]).has({right: "me", rights: "POSTS_CREATE"}))
      return { successed: false, resource: null, error: "403 Forbidenn" };

    for (const required of REQUIRED_DATA_TO_CREATE_POST) {
      if (!Object.keys({...post, creator_id: userId}).includes(required)) {
        return {
          successed: false,
          error: "there is no required data",
          resource: null
        };
      }
    }

    return {
      successed: true,
      resource: DB.Database.parse(await new DB.Post({...post, creator_id: userId}).init(), "posts"),
      error: null,
    };
  }

  public async putPost(user: LAFka.User): Promise<ServiceResponse<LAFka.Post>> {
    return { successed: false, resource: null, error: "the method has not been initialized" }
  }

  public async deletePost(user: LAFka.User): Promise<ServiceResponse<LAFka.Post>> {
    return { successed: false, resource: null, error: "the method has not been initialized" }
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