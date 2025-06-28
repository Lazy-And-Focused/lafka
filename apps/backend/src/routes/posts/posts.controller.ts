import { LAFka } from "lafka/types";
import Database from "lafka/database";

import { Request } from "express";
import {
  Controller,
  Delete,
  Get,
  Inject,
  Injectable,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards
} from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

import { POSTS_CONTROLLER, POSTS_ROUTES } from "./posts.routes";
import { PostsService } from "./posts.service";
import { Public } from "decorators/public.decorator";

import { AuthGuard } from "guards/auth/auth.guard";

import Hash from "api/hash.api";
import Api from "api/index.api";

const api = new Api();

@Injectable()
@Controller(POSTS_CONTROLLER)
@UseGuards(AuthGuard)
export class PostsContoller {
  public constructor(
    private readonly postsService: PostsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @Public()
  @Get(POSTS_ROUTES.GET)
  public async getPosts(
    @Req() req: Request,
    @Query("offset") offset?: string,
    @Query("count") count?: string,
    @Query("sortBy") sortBy?: string,
    @Query("sortType") sortType?: string,
    @Query("cache") cache?: string
  ): Promise<LAFka.Response.GetData<LAFka.LazyPost[]>> {
    const { successed } = Hash.parse(req);

    if (!successed) return { successed: false, type: "posts", error: "Hash parse error", resource: null };

    const cacheManager = api.useCache<LAFka.LazyPost[]>(this.cacheManager, cache, "posts");
    const posts = await cacheManager<[Partial<{
      offset: string,
      count: string,
      sortBy: string,
      sortType: string
    }>]>({
      key: `posts-${offset}|${count}|${sortBy}|${sortType}}`,
      getFunction: this.postsService.getPosts,
      data: [{ offset, count, sortBy, sortType }]
    });

    return {...posts, type: "posts" }
  }

  @Public()
  @Get(POSTS_ROUTES.GET_ONE)
  public async getPost(
    @Req() req: Request,
    @Param("id") id: string,
    @Query("cache") cache?: string
  ): Promise<LAFka.Response.GetData<LAFka.LazyPost>> {
    const { successed } = Hash.parse(req);

    if (!successed) return { successed: false, error: "Hash parse error", resource: null, type: "posts" };

    const cacheManager = api.useCache<LAFka.LazyPost>(this.cacheManager, cache, "posts");
    const post = await cacheManager<[Partial<LAFka.LazyPost> | string]>({
      key: `post-${id}`,
      getFunction: this.postsService.getPost,
      data: [id]
    });

    return {...post, type: "posts"};
  }

  @Post(POSTS_ROUTES.POST)
  public async createPost(
    @Req() req: Request,
  ): Promise<LAFka.Response.CreateData<LAFka.LazyPost>> {
    const date = new Date().toISOString();
    const { successed, profile_id } = Hash.parse(req);
    
    if (!successed) return { date, created_resource: null, error: "Hash parse error", successed: false, type: "posts" };

    const body = Database.parse({...req.body, created_at: date}, "posts");
    const post = await this.postsService.createPost(profile_id, body);

    if (!post.successed)
      return { successed: false, created_resource: null, error: post.error, date, type: "posts" };

    return {
      successed: post.successed,
      created_resource: post.resource,
      error: null,
      date,
      type: "posts"
    };
  };

  private readonly _locked_keys_to_change = <((keyof LAFka.LazyPost)[])>[
    "comments",
    "reposts"
  ];

  @Put(POSTS_ROUTES.PUT)
  public async putPost(
    @Req() req: Request,
    @Param("id") postId: string
  ): Promise<LAFka.Response.ChangeData> {
    const date = new Date().toISOString();
    const { successed, profile_id } = Hash.parse(req);

    if (!successed) return { date, changed_resource: null, error: "Hash parse error", successed: false, type: "posts" };

    const post = Database.parse<LAFka.Post>({...req.body, id: postId}, "posts");
    const keys = Object.keys(post);

    if (this._locked_keys_to_change.filter(locked => keys.includes(locked)).length !== 0) {
      return {
        date,
        changed_resource: null,
        error: `Your data has "locked" keys. All "locked" keys:\n${JSON.stringify(this._locked_keys_to_change, undefined, 2)}`,
        successed: false,
        type: "posts"
      };
    };

    if (!post.id) return { date, changed_resource: null, error: "Post id is not defined", successed: false, type: "posts" };
    
    const response = await this.postsService.putPost(profile_id, post);
    
    return {
      successed: response.successed,
      error: response.error,
      changed_resource: response.resource,
      type: "posts",
      date,
    } as LAFka.Response.ChangeData;
  };

  @Delete(POSTS_ROUTES.DELETE)
  public async deletePost(
    @Req() req: Request,
    @Param("id") postId: string
  ): Promise<LAFka.Response.DeleteData> {
    const date = new Date().toISOString();
    const { successed, profile_id } = Hash.parse(req);
 
    if (!successed) return { date, deleted_resource: null, error: "Hash parse error", successed: false, type: "posts" };

    const response = await this.postsService.deletePost(profile_id, postId);

    return {
      date,
      type: "posts",
      successed: response.successed,
      deleted_resource: response.resource,
      error: response.error,
    } as LAFka.Response.DeleteData;
  };
}