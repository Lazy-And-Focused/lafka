import { LAFka } from "lafka/types";
import DB from "lafka/database"

import { Request } from "express";
import { Controller, Get, Inject, Injectable, Param, Put, Query, Req, UseGuards } from "@nestjs/common";
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
    const formatted = UsersService.formatGetData(identifier);
    const key = Object.keys(formatted)[0]
    const formattedIdentifier: string = formatted[key];

    if (formatted instanceof Error) return { successed: false, error: formatted.message, type: "users" };
    
    const value = await api.getCache<LAFka.User>(`user-${formattedIdentifier}`, this.cacheManager, cache);
    if (value) return { successed: true, resource: value, type: "users" };

    const user = await this.usersService.getUser(formatted);
    this.cacheManager.set<LAFka.User>(`user-${formattedIdentifier}`, user.resource);

    return {
      ...user,
      type: "users"
    };
  };

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

    return {...user, type: "users" };
  }

  @Put(USERS_ROUTES.PUT)
  public async put(
    @Req() req: Request,
    @Query("returnUser") returnUser?: string
  ): Promise<LAFka.Response.ChangeData<LAFka.User>> {
    const { successed, profile_id } = Hash.parse(req);
    const date = new Date();

    if (!successed) return { successed: false, date, changed_resource_type: "resource", type: "users" };
    const user: Partial<LAFka.User> = DB.Database.parse(req.body, "users");

    (async () => {
      const value = await api.getCache<LAFka.User>(`user-${profile_id}`, this.cacheManager);
      if (value) return value;

      const { successed, resource } = await this.usersService.getUser(profile_id);
      if (successed) return resource;

      return null;
    })().then(u => this.cacheManager.set(`user-${profile_id}`, u));

    const data = await this.usersService.updateUser(profile_id, user, returnUser === "true");

    return {
      ...data,
      date,
      changed_resource_type: returnUser === "true" ? "resource" : "update",
      type: "users"
    };
  }
}
