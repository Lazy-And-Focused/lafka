import { LAFka } from "lafka/types";
import { UpdateWriteOpResult } from "mongoose";
import { DeleteResult } from "lafka/database/types/mongodb.types";
import Database from "lafka/database/index";

import { Request } from "express";
import {
  Controller,
  Delete,
  Get,
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

const api = new Api();

@Injectable()
@Controller(USERS_CONTROLLER)
@UseGuards(AuthGuard)
export class UsersController {
  public constructor(
    private usersService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

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

  @Get(USERS_ROUTES.GET_ME)
  public async getMe(
    @Req() req: Request,
    @Query("cache") cache?: string
  ): Promise<LAFka.Response.GetData<LAFka.User>> {
    const { successed, profile_id } = Hash.parse(req);
    const cacheManager = api.useCache<LAFka.User>(this.cacheManager, cache, "users");

    if (!successed) return { successed: false, error: "Hash parse error", resource: null, type: "users" };

    const user = cacheManager<[Partial<LAFka.User> | string]>({
      getFunction: this.usersService.getUser,
      key: `user-${profile_id}`,
      data: [profile_id]
    });

    return user;
  }

  @Put(USERS_ROUTES.PUT)
  public async put(
    @Req() req: Request,
    @Param("identifier") identifier: string,
    @Query("returnUser") returnUser?: string,
    @Query("cache") cache?: string
  ): Promise<LAFka.Response.ChangeData<LAFka.User>> {
    const date = new Date().toISOString();

    const slug = UsersService.lazyGetSlug(identifier);
    if (typeof slug !== "string")
      return { ...slug, successed: false, date, changed_resource: null };

    const { successed } = Hash.parse(req);

    if (!successed)
      return { successed: false, error: "Hash parse error", date, changed_resource: null, type: "users" };
    const user: Partial<LAFka.User> = Database.parse(req.body, "users");
    const cacheManager = api.useCache<LAFka.User>(this.cacheManager, cache, "users");

    const data = await this.usersService.updateUser(slug, user, returnUser === "true");

    (async () => {
      if (returnUser === "true") {
        this.cacheManager.set(`user-${slug}`, data.resource)
      } else {
        this.cacheManager.set(`user-${slug}`, {
          ...cacheManager<[Partial<LAFka.User> | string]>({
            key: `user-${slug}`,
            getFunction: this.usersService.getUser,
            data: [slug],
          }),
          ...user
        });
      };
    })();

    if (!data.successed)
      return { successed: false, type: "users", error: data.error, date, changed_resource: null };

    return {
      successed: true,
      date,
      error: null,
      changed_resource_type: returnUser === "true" ? "resource" : "update",
      changed_resource: data.resource as LAFka.User & UpdateWriteOpResult,
      type: "users"
    };
  }

  @Delete(USERS_ROUTES.DELETE)
  public async delete(
    @Req() req: Request,
    @Param("identifier") identifier: string,
    @Query("returnUser") returnUser?: string
  ): Promise<LAFka.Response.DeleteData<LAFka.User>> {
    const date = new Date().toISOString();
    const deleted_resource_type = returnUser === "true" ? "resource" : "delete"

    const slug = UsersService.lazyGetSlug(identifier);
    if (typeof slug !== "string")
      return { ...slug, successed: false, date, deleted_resource: null };

    const { successed } = Hash.parse(req);
    if (!successed)
      return { successed: false, deleted_resource: null, date, error: "Hash parse error", type: "users" };

    this.cacheManager.del(`user-${slug}`);

    const data = await this.usersService.deleteUser(slug, returnUser === "true");

    return {
      successed: data.successed,
      date, 
      deleted_resource_type,
      type: "users",
      error: null,
      deleted_resource: data.resource as LAFka.User & DeleteResult
    };
  }
}
