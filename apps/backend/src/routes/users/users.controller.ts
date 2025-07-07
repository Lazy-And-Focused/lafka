import { LAFka } from "lafka/types";
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
import { USERS_ROUTES, USERS_CONTROLLER } from "./users.routes";

import { AuthGuard } from "guards/auth/auth.guard";
import { Public } from "decorators/public.decorator";

import Hash from "api/hash.api";
import Api from "api/index.api";
import { ApiOperation, ApiResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { UserUpdateDto } from "./user.data";

const api = new Api();

@Injectable()
@Controller(USERS_CONTROLLER)
@UseGuards(AuthGuard)
export class UsersController {
  public constructor(
    private usersService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @ApiOperation({ summary: "Getting a user by slug" })
  @Get(USERS_ROUTES.GET)
  @Public()
  public async get(
    @Param("identifier") identifier: string,
    @Query("cache") cache?: string
  ): Promise<LAFka.Response.GetData<LAFka.User>> {
    const slug = UsersService.lazyGetSlug(identifier);

    if (typeof slug !== "string")
      return { ...slug, successed: false, resource: null };
    
    const cacheManager = api.useCache<LAFka.User>(this.cacheManager, cache, "users");
    const user = await cacheManager<[Partial<LAFka.User> | string]>({
      key: `user-${slug}`,
      getFunction: this.usersService.getUser,
      data: [slug]
    });

    return user;
  }

  @ApiOperation({ summary: "Getting a self-user (you)" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Getted",
  })
  @Get(USERS_ROUTES.GET_ME)
  public async getMe(
    @Req() req: Request,
    @Query("cache") cache?: string
  ): Promise<LAFka.Response.GetData<LAFka.User>> {
    const { successed, profile_id } = Hash.parse(req);
    const cacheManager = api.useCache<LAFka.User>(this.cacheManager, cache, "users");

    if (!successed) return { ...api.createError("Hash parse error"), type: "users" };

    const user = cacheManager<[Partial<LAFka.User> | string]>({
      getFunction: this.usersService.getUser,
      key: `user-${profile_id}`,
      data: [profile_id]
    });

    return user;
  }

  @ApiOperation({ summary: "Update user's data" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Updated"
  })
  @Put(USERS_ROUTES.PUT)
  public async put(
    @Req() req: Request,
    @Param("identifier") identifier: string,
    @Query("cache") cache?: string,
    @Body() putData?: UserUpdateDto
  ): Promise<LAFka.Response.ChangeData> {
    const date = new Date().toISOString();

    const slug = UsersService.lazyGetSlug(identifier);
    if (typeof slug !== "string")
      return { ...slug, successed: false, date, changed_resource: null };

    const { successed } = Hash.parse(req);

    if (!successed)
      return { ...api.createError("Hash parse error"), date, type: "users" };
    const user: Partial<LAFka.User> = Database.parse(putData, "users");
    const cacheManager = api.useCache<LAFka.User>(this.cacheManager, cache, "users");

    const data = await this.usersService.updateUser(slug, user);

    (async () => {
      this.cacheManager.set(`user-${slug}`, {
        ...cacheManager<[Partial<LAFka.User> | string]>({
          key: `user-${slug}`,
          getFunction: this.usersService.getUser,
          data: [slug],
        }),
        ...user
      });
    })();

    return {
      successed: data.successed,
      changed_resource: data.resource,
      error: data.error,
      date,
      type: "users"
    } as LAFka.Response.ChangeData;
  }

  @ApiOperation({ summary: "Deletes a user by slug"})
  @ApiUnauthorizedResponse({ description: "Unauthorized"})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Deleted"
  })
  @Delete(USERS_ROUTES.DELETE)
  public async delete(
    @Req() req: Request,
    @Param("identifier") identifier: string,
  ): Promise<LAFka.Response.DeleteData> {
    const date = new Date().toISOString();

    const slug = UsersService.lazyGetSlug(identifier);
    
    if (typeof slug !== "string")
      return { ...slug, successed: false, date, deleted_resource: null };

    const { successed } = Hash.parse(req);
    if (!successed)
      return { ...api.createError("Hash parse error"), date, type: "users" };

    this.cacheManager.del(`user-${slug}`);

    const data = await this.usersService.deleteUser(slug);

    return {
      successed: data.successed,
      date, 
      type: "users",
      error: data.error,
      deleted_resource: data.resource
    } as LAFka.Response.DeleteData;
  }
}
