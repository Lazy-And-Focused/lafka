import { LAFka } from "lafka/types";
import DB from "lafka/database";

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
    const formatted = UsersService.formatGetData<false>(identifier, false);

    if (formatted instanceof Error)
      return { successed: false, error: formatted.message, type: "users" };
    const formattedIdentifier = UsersService.formatGettedData(formatted);

    const value = await api.getCache<LAFka.User>(
      `user-${formattedIdentifier}`,
      this.cacheManager,
      cache
    );
    if (value) return { successed: true, resource: value, type: "users" };

    const user = await this.usersService.getUser(formatted);
    this.cacheManager.set<LAFka.User>(`user-${formattedIdentifier}`, user.resource);

    return {
      ...user,
      type: "users"
    };
  }

  @Get(USERS_ROUTES.GET_ME)
  public async getMe(
    @Req() req: Request,
    @Query("cache") cache?: string
  ): Promise<LAFka.Response.GetData<LAFka.User>> {
    const { successed, profile_id } = Hash.parse(req);

    if (!successed) return { successed: false, type: "users" };

    const value = await api.getCache<LAFka.User>(`user-${profile_id}`, this.cacheManager, cache);
    if (value) return { successed: true, resource: value, type: "users" };

    const user = await this.usersService.getUser(profile_id);
    this.cacheManager.set<LAFka.User>(`user-${profile_id}`, user.resource);

    return { ...user, type: "users" };
  }

  @Put(USERS_ROUTES.PUT)
  public async put(
    @Req() req: Request,
    @Param("identifier") identifier: string,
    @Query("returnUser") returnUser?: string,
    @Query("cache") cache?: string
  ): Promise<LAFka.Response.ChangeData<LAFka.User>> {
    const date = new Date();

    const id = UsersService.formatGetData<true>(identifier, true);
    if (id instanceof Error)
      return {
        successed: false,
        error: id.message,
        date,
        changed_resource_type: "resource",
        type: "users"
      };

    const { successed } = Hash.parse(req);

    if (!successed)
      return { successed: false, date, changed_resource_type: "resource", type: "users" };
    const user: Partial<LAFka.User> = DB.Database.parse(req.body, "users");

    (async () => {
      const value = await api.getCache<LAFka.User>(`user-${id}`, this.cacheManager, cache);
      if (value) return value;

      const { successed, resource } = await this.usersService.getUser(id);
      if (successed) return resource;

      return null;
    })().then((u) => this.cacheManager.set(`user-${id}`, u));

    const data = await this.usersService.updateUser(id, user, returnUser === "true");

    return {
      successed: data.successed,
      date,
      changed_resource_type: returnUser === "true" ? "resource" : "update",
      changed_resource: data.resource,
      type: "users"
    };
  }

  @Delete(USERS_ROUTES.DELETE)
  public async delete(
    @Req() req: Request,
    @Param("identifier") identifier: string,
    @Query("returnUser") returnUser?: string
  ): Promise<LAFka.Response.DeleteData<LAFka.User>> {
    const date = new Date();

    const id = UsersService.formatGetData<true>(identifier, true);
    if (id instanceof Error)
      return {
        successed: false,
        error: id.message,
        date,
        deleted_resource_type: "resource",
        type: "users"
      };

    const { successed } = Hash.parse(req);
    if (!successed)
      return { successed: false, date, deleted_resource_type: "resource", type: "users" };

    this.cacheManager.del(`user-${id}`);

    const data = await this.usersService.deleteUser(id, returnUser === "true");

    return {
      successed: data.successed,
      date,
      deleted_resource_type: returnUser === "true" ? "resource" : "delete",
      type: "users",
      deleted_resource: data.resource
    };
  }
}
