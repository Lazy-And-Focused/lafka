import { LAFka } from "lafka/types";
import Database, { Models } from "lafka/database";

import { Request } from "express";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
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
import { ApiOperation, ApiResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CreatePostDto, UpdatePostDto } from "./post.data";

const api = new Api();

const { posts } = new Models();

@Injectable()
@Controller(POSTS_CONTROLLER)
@UseGuards(AuthGuard)
export class PostsContoller {
  public constructor(
    private readonly postsService: PostsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @ApiOperation({ summary: "get a posts by query"})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Getted"
  })
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

    return { ...posts, type: "posts" }
  }

  @ApiOperation({ summary: "Get a post by id" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Getted"
  })
  @Public()
  @Get(POSTS_ROUTES.GET_ONE)
  public async getPost(
    @Req() req: Request,
    @Param("id") id: string,
    @Query("cache") cache?: string
  ): Promise<LAFka.Response.GetData<LAFka.LazyPost>> {
    const { successed } = Hash.parse(req);

    if (!successed) return { ...api.createError("Hash parse error"), type: "posts" };

    const cacheManager = api.useCache<LAFka.LazyPost>(this.cacheManager, cache, "posts");
    const post = await cacheManager<[Partial<LAFka.LazyPost> | string]>({
      key: `post-${id}`,
      getFunction: this.postsService.getPost,
      data: [id]
    });

    return { ...post, type: "posts"};
  }

  @ApiOperation({summary: "Creating a post"})
  @ApiUnauthorizedResponse({ description: "Unauthorized"})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Created"
  })
  @Post(POSTS_ROUTES.POST)
  public async createPost(
    @Req() req: Request,
    @Body() postData: CreatePostDto
  ): Promise<LAFka.Response.CreateData<LAFka.LazyPost>> {
    const date = new Date().toISOString();
    const { successed, profile_id } = Hash.parse(req);
    
    if (!successed) return { ...api.createError("Hash parse error"), type: "posts", date };

    const body = Database.parse({...postData, created_at: date}, "posts");
    const post = await this.postsService.createPost(profile_id, body);

    this.cacheManager.set(`post-${post.resource.id}`, post.resource);

    if (!post.successed)
      return { ...api.createError(post.error), date, type: "posts" };

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

  @ApiOperation({summary: "Updates post data"})
  @ApiUnauthorizedResponse({description: "Unauthorized"})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Updated"
  })
  @Put(POSTS_ROUTES.PUT)
  public async putPost(
    @Req() req: Request,
    @Param("id") postId: string,
    @Body() putData: UpdatePostDto
  ): Promise<LAFka.Response.ChangeData> {
    const date = new Date().toISOString();
    const { successed, profile_id } = Hash.parse(req);

    if (!successed) return { ...api.createError("Hash parse error"), date, type: "posts" };

    const post = Database.parse<LAFka.Post>({...(putData as LAFka.Post), id: postId}, "posts");
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

    if (!post.id) return { ...api.createError("Post id is not defined"), date, type: "posts" };
    
    const response = await this.postsService.putPost(profile_id, post);
    
    posts.model.findById(post.id).then(p => this.cacheManager.set(`post-${post.id}`, p.toObject()));

    return {
      successed: response.successed,
      error: response.error,
      changed_resource: response.resource,
      type: "posts",
      date,
    } as LAFka.Response.ChangeData;
  };

  @ApiOperation({ summary: "Deletes a post by id"})
  @ApiUnauthorizedResponse({description: "Unauthorized"})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Deleted"
  })
  @Delete(POSTS_ROUTES.DELETE)
  public async deletePost(
    @Req() req: Request,
    @Param("id") postId: string
  ): Promise<LAFka.Response.DeleteData> {
    const date = new Date().toISOString();
    const { successed, profile_id } = Hash.parse(req);
 
    if (!successed) return { ...api.createError("Hash parse error"), date, type: "posts" };

    const response = await this.postsService.deletePost(profile_id, postId);

    this.cacheManager.del(`post-${postId}`)

    return {
      date,
      type: "posts",
      successed: response.successed,
      deleted_resource: response.resource,
      error: response.error,
    } as LAFka.Response.DeleteData;
  };
}