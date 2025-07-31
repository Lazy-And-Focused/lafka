import { CreateComment, LazyPost, Response } from "lafka/types";
import Database, { Models } from "lafka/database";

import { Request } from "express";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards
} from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

import { ROUTE, ROUTES } from "./posts.routes";
import { PostsService } from "./posts.service";
import { Public } from "decorators/public.decorator";

import { AuthGuard } from "guards/auth/auth.guard";

import Hash from "api/hash.api";
import Api from "api/index.api";
import { ApiOperation, ApiResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CreateCommentDto, CreatePostDto, UpdatePostDto } from "./post.data";
import { Rights } from "@lafka/rights";

const api = new Api();

const { posts } = new Models();

@Injectable()
@Controller(ROUTE)
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
  @Get(ROUTES.GET)
  public async getPosts(
    @Req() req: Request,
    @Query("offset") offset?: string,
    @Query("count") count?: string,
    @Query("sortBy") sortBy?: string,
    @Query("sortType") sortType?: string,
    @Query("cache") cache?: string
  ): Promise<Response<LazyPost[]>> {
    const { successed } = Hash.parse(req);

    if (!successed) return api.createError("Hash parse error");

    const cacheManager = api.useCache<LazyPost[]>(this.cacheManager, cache);
    
    return cacheManager<[Partial<{
      offset: string,
      count: string,
      sortBy: string,
      sortType: string
    }>]>({
      key: `posts-${offset}|${count}|${sortBy}|${sortType}}`,
      getFunction: this.postsService.getPosts,
      data: [{ offset, count, sortBy, sortType }]
    });
  }

  @ApiOperation({ summary: "Get a post by id" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Getted"
  })
  @Public()
  @Get(ROUTES.GET_ONE)
  public async getPost(
    @Req() req: Request,
    @Param("id") id: string,
    @Query("cache") cache?: string
  ): Promise<Response<LazyPost>> {
    const { successed } = Hash.parse(req);

    if (!successed) return api.createError("Hash parse error");

    const cacheManager = api.useCache<LazyPost>(this.cacheManager, cache);
    return await cacheManager<[Partial<LazyPost> | string]>({
      key: `post-${id}`,
      getFunction: this.postsService.getPost,
      data: [id]
    });
  }

  @ApiOperation({ summary: "Get post comments"})
  @ApiUnauthorizedResponse({description: "Unauthorized"})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Getted"
  })
  @Get(ROUTES.GET_COMMENTS)
  @Public()
  public async getComments(
    @Param("id") postId: string,
    @Query("cache") cache: string
  ) {
    const cacheManager = api.useCache<string[]>(this.cacheManager, cache);
    
    return cacheManager({
      getFunction: this.postsService.getComments,
      data: [postId],
      key: `post-${postId}-comments`
    });
  }

  @ApiOperation({summary: "Creating a post"})
  @ApiUnauthorizedResponse({ description: "Unauthorized"})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Created"
  })
  @Post(ROUTES.POST)
  public async createPost(
    @Req() req: Request,
    @Body() postData: CreatePostDto
  ): Promise<Response<LazyPost>> {
    const { successed, profile_id } = Hash.parse(req);
    
    if (!successed) return api.createError("Hash parse error")

    const body = Database.parse({...postData}, "posts");
    const post = await this.postsService.createPost(profile_id, body);

    if (!post.successed)
      return api.createError(post.error)

    this.cacheManager.set(`post-${post.data.id}`, post.data);

    return post;
  };

  @ApiOperation({ summary: "Create commet to post"})
  @ApiUnauthorizedResponse({description: "Unauthorized"})
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Created"
  })
  @Post(ROUTES.POST_COMMENT)
  public async postComment(
    @Req() req: Request,
    @Param("id") postId: string,
    @Body() body: CreateCommentDto
  ) {
    const { successed, profile_id } = Hash.parse(req);
 
    if (!successed) return api.createError("Hash parse error");
    
    const data = Database.parse({ ...body, post_id: postId, author_id: profile_id }, "comments");

    return this.postsService.postComment(data);
  }

  private readonly _locked_keys_to_change = <((keyof LazyPost)[])>[
    "comments",
    "reposts"
  ];

  @ApiOperation({summary: "Updates post data"})
  @ApiUnauthorizedResponse({description: "Unauthorized"})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Updated"
  })
  @Put(ROUTES.PUT)
  public async putPost(
    @Req() req: Request,
    @Param("id") postId: string,
    @Body() putData: UpdatePostDto
  ): Promise<Response<unknown>> {
    const { successed, profile_id } = Hash.parse(req);

    if (!successed) return api.createError("Hash parse error")
    
    const databasePost = await this.cacheManager.get<LazyPost>(`post-${postId}`) ?? (await posts.model.findById(postId)).toObject();
    
    const hasRights = new Rights.PostService(databasePost).userHas(profile_id)("MANAGER");
    if (!hasRights) {
      throw new HttpException("Forbidenn", HttpStatus.FORBIDDEN);
    };

    const post = Database.parse<LazyPost>(<LazyPost>putData, "posts");
    const keys = Object.keys(post);

    if (this._locked_keys_to_change.filter(locked => keys.includes(locked)).length !== 0) {
      return {
        error: `Your data has "locked" keys. All "locked" keys:\n${JSON.stringify(this._locked_keys_to_change, undefined, 2)}`,
        successed: false,
        data: null
      };
    };

    if (!post.id) return api.createError("Post id is not defined")
    const data = await this.postsService.putPost(post);
    
    posts.model.findById(post.id).then(p => this.cacheManager.set(`post-${post.id}`, p.toObject()));

    return data;
  };

  @ApiOperation({summary: "Block post for self"})
  @ApiUnauthorizedResponse({description: "Unauthorized"})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Blocked/Unblocked"
  })
  @Patch(ROUTES.PATCH_BLOCK)
  public async patchBlock(
    @Req() req: Request,
    @Param("id") postId: string
  ) {
    const { successed, profile_id } = Hash.parse(req);

    if (!successed) return api.createError("Hash parse error")

    const data = await this.postsService.blockPost(profile_id, postId);

    this.cacheManager.set(`user-${profile_id}`, data.data);

    return data;
  }

  @ApiOperation({summary: "Follow to post"})
  @ApiUnauthorizedResponse({description: "Unauthorized"})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Follow/Unfollow"
  })
  @Patch(ROUTES.PATCH_BLOCK)
  public async patchFollow(
    @Req() req: Request,
    @Param("id") postId: string
  ) {
    const { successed, profile_id } = Hash.parse(req);

    if (!successed) return api.createError("Hash parse error")

    const databasePost = await this.cacheManager.get<LazyPost>(`post-${postId}`) ?? (await posts.model.findById(postId)).toObject();

    const data = await this.postsService.followPost(profile_id, postId, databasePost.type);
    
    this.cacheManager.set(`user-${profile_id}`, data.data);
    
    return data;
  }

  @ApiOperation({ summary: "Deletes a post by id"})
  @ApiUnauthorizedResponse({description: "Unauthorized"})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Deleted"
  })
  @Delete(ROUTES.DELETE)
  public async deletePost(
    @Req() req: Request,
    @Param("id") postId: string
  ): Promise<Response<unknown>> {
    const { successed, profile_id } = Hash.parse(req);
 
    if (!successed) return api.createError("Hash parse error")

    const data = await this.postsService.deletePost(profile_id, postId);

    this.cacheManager.del(`post-${postId}`);

    return data
  };
}