import Database from "lafka/database/index";

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
  Put,
  Query,
  Req,
  UseGuards
} from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

import { UsersService } from "./users.service";
import { ROUTES, ROUTE } from "./users.routes";

import { AuthGuard } from "guards/auth/auth.guard";
import { Public } from "decorators/public.decorator";

import Hash from "api/hash.api";
import Api from "api/index.api";
import { ApiOperation, ApiResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { UserUpdateDto } from "./user.data";
import { Response, User } from "lafka/types";

const api = new Api();

@Injectable()
@Controller(ROUTE)
@UseGuards(AuthGuard)
export class UsersController {
  public constructor(
    private usersService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @ApiOperation({ summary: "Getting a user by slug" })
  @Get(ROUTES.GET)
  @Public()
  public async get(
    @Param("id") id: string,
    @Query("cache") cache?: string
  ): Promise<Response<User>> {
    const slug = UsersService.lazyGetSlug(id);

    if (typeof slug !== "string")
      return slug;
    
    const cacheManager = api.useCache<User>(this.cacheManager, cache);
    
    return cacheManager<[Partial<User> | string]>({
      key: `user-${slug}`,
      getFunction: this.usersService.getUser,
      data: [slug]
    });
  }

  @ApiOperation({ summary: "Getting a self-user (you)" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Getted",
  })
  @Get(ROUTES.GET_ME)
  public async getMe(
    @Req() req: Request,
    @Query("cache") cache?: string
  ): Promise<Response<User>> {
    const { successed, profile_id } = Hash.parse(req);
    const cacheManager = api.useCache<User>(this.cacheManager, cache);

    if (!successed) return api.createError("Hash parse error");

    return cacheManager<[Partial<User> | string]>({
      getFunction: this.usersService.getUser,
      key: `user-${profile_id}`,
      data: [profile_id]
    });
  }

  @ApiOperation({ summary: "Update user's data" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Updated"
  })
  @Put(ROUTES.PUT)
  public async put(
    @Req() req: Request,
    @Param("identifier") identifier: string,
    @Query("cache") cache?: string,
    @Body() putData?: UserUpdateDto
  ): Promise<Response<unknown>> {
    const slug = UsersService.lazyGetSlug(identifier);
    if (typeof slug !== "string")
      return slug;

    const { successed } = Hash.parse(req);

    if (!successed)
      return { ...api.createError("Hash parse error") };
    
    const user: Partial<User> = Database.parse(putData, "users");
    const cacheManager = api.useCache<User>(this.cacheManager, cache);

    const data = await this.usersService.updateUser(slug, user);

    (async () => {
      this.cacheManager.set(`user-${slug}`, {
        ...cacheManager<[Partial<User> | string]>({
          key: `user-${slug}`,
          getFunction: this.usersService.getUser,
          data: [slug],
        }),
        ...user
      });
    })();

    return data;
  }

  @ApiOperation({ summary: "Deletes a user by slug"})
  @ApiUnauthorizedResponse({ description: "Unauthorized"})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Deleted"
  })
  @Delete(ROUTES.DELETE)
  public async delete(
    @Req() req: Request,
    @Param("identifier") identifier: string,
  ): Promise<Response<unknown>> {
    const slug = UsersService.lazyGetSlug(identifier);
    
    if (typeof slug !== "string")
      return slug;

    const { successed } = Hash.parse(req);
    if (!successed)
      return api.createError("Hash parse error");

    this.cacheManager.del(`user-${slug}`);

    return this.usersService.deleteUser(slug);
  }
}
