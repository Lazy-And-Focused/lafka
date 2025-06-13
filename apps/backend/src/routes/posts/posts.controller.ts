import { LAFka } from "lafka/types";
import DB from "lafka/database";

import { Request } from "express";
import {
  Controller,
  Get,
  Inject,
  Injectable,
  Param,
  Post,
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
    @Query("sortType") sortType?: string
  ): Promise<LAFka.Response.GetData<LAFka.LazyPost[]>> {
    const { successed } = Hash.parse(req);

    if (!successed)
      return {
        successed: false,
        type: "posts",
        error: "",
        resource: null
      };

    const posts = await this.postsService.getPosts({
      offset, count, sortBy, sortType
    });

    return {...posts, type: "posts" }
  }

  @Public()
  @Get(POSTS_ROUTES.GET_ONE)
  public async getPost(
    @Req() req: Request,
    @Param("id") id: string
  ): Promise<LAFka.Response.GetData<LAFka.LazyPost>> {
    const { successed } = Hash.parse(req);

    if (!successed)
      return {
        successed: false,
        error: "Hash parse error",
        resource: null,
        type: "posts"
      };

    const post = await this.postsService.getPost(id);

    return {...post, type: "posts"};
  }

  @Post(POSTS_ROUTES.POST)
  public async createPost(
    @Req() req: Request,
  ): Promise<LAFka.Response.CreateData<LAFka.LazyPost>> {
    const date = new Date().toISOString();
    const { successed, profile_id } = Hash.parse(req);
    
    if (!successed)
      return {
        date,
        created_resource: null,
        error: "Hash parse error",
        successed: false,
        type: "posts"
      };

    const body = DB.Database.parse({...req.body, created_at: date}, "posts");
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
  }
}