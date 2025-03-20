import { LAFka } from "lafka/types";

import { Request } from "express";
import { Controller, Get, Inject, Injectable, Param, Query, Req, UseGuards } from "@nestjs/common";
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

  @Get(USERS_ROUTES.GET_ME)
  public async getMe(
    @Req() req: Request,
    @Query("cache") cache?: string
  ): Promise<LAFka.Response.GetData<LAFka.User>> {
    const { successed, profile_id } = Hash.parse(req);

    if (!successed) return {successed: false, type: "users"};
    
    const value = await api.getCache<LAFka.User>(`profileid-${profile_id}`, this.cacheManager, cache);
    if (value) return { successed: true, resource: value, type: "users" };
    
    const user = await this.usersService.getUser(profile_id);
    this.cacheManager.set<LAFka.User>(`profileid-${profile_id}`, user.resource);

    return {...user, type: "users" };
  }
  
  @Get(USERS_ROUTES.GET)
  @Public()
  public async get(
    @Param("identifier") identifier: string,
    @Query("cache") cache?: string
  ): Promise<LAFka.Response.GetData<LAFka.User>> {
    const formatted = UsersService.formatGetData(identifier);

    if (formatted instanceof Error) return { successed: false, error: formatted.message, type: "users" };
    
    const value = await api.getCache<LAFka.User>(`data-${JSON.stringify(formatted, undefined, 0)}`, this.cacheManager, cache);
    if (value) return { successed: true, resource: value, type: "users" };

    const user = await this.usersService.getUser(formatted);
    this.cacheManager.set<LAFka.User>(`data-${JSON.stringify(formatted, undefined, 0)}`, user.resource);

    return {
      ...user,
      type: "users"
    };
  }
}
