import Database from "lafka/database/index";

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
  Put,
  Query,
  Req,
  UseGuards
} from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

import { Service } from "./users.service";
import { ROUTES, ROUTE } from "./users.routes";

import { AuthGuard } from "guards/auth/auth.guard";
import { Public } from "decorators/public.decorator";

import Hash from "api/hash.api";
import Api from "api/index.api";
import { ApiOperation, ApiResponse, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { UserUpdateDto } from "./user.data";
import type { Response, User } from "lafka/types";

const api = new Api();

@Injectable()
@Controller(ROUTE)
@UseGuards(AuthGuard)
export class UsersController {
  public constructor(
    private service: Service,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @ApiOperation({ summary: "Getting a user by slug" })
  @Get(ROUTES.GET)
  @Public()
  public async get(
    @Req() req: Request,
    @Param("id") id: string,
    @Query("cache") cache?: string
  ): Promise<Response<User>> {
    const slug = Service.lazyGetSlug(id);
    
    if (typeof slug !== "string") return slug;
    if (id !== "@me") return this.getUser(slug, cache);
    
    const { successed, profile_id } = Hash.parse(req);
    if (!successed) throw new HttpException(api.createError("Hash parse error"), HttpStatus.FORBIDDEN);;
    
    return this.getUser(profile_id, cache);
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
    @Param("id") id: string,
    @Query("cache") cache?: string,
    @Body() putData?: UserUpdateDto
  ): Promise<Response<unknown>> {
    const slug = Service.lazyGetSlug(id);
    if (typeof slug !== "string")
      return slug;

    const { successed } = Hash.parse(req);

    if (!successed)
      throw new HttpException(api.createError("Hash parse error"), HttpStatus.FORBIDDEN);
    
    const user: Partial<User> = Database.parse(putData, "users");
    const cacheManager = api.useCache<User>(this.cacheManager, cache);

    const data = await this.service.updateUser(slug, user);

    (async () => {
      this.cacheManager.set(`user-${slug}`, {
        ...cacheManager<[Partial<User> | string]>({
          key: `user-${slug}`,
          getFunction: this.service.getUser,
          data: [slug],
        }),
        ...user
      });
    })();

    return data;
  }

  @ApiOperation({ summary: "Update user's data" })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Updated"
  })
  @Put(ROUTES.PUT)
  public async patchFollow(
    @Req() req: Request,
    @Param("id") id: string,
  ) {
    const { successed, profile_id } = Hash.parse(req);

    if (!successed)
      throw new HttpException(api.createError("Hash parse error"), HttpStatus.FORBIDDEN);

    if (id === profile_id)
      throw new HttpException("You can't follow self", HttpStatus.BAD_REQUEST);

    const data = await this.service.followUser(profile_id, id);
    
    if (!data.successed) throw new HttpException(data.error, HttpStatus.INTERNAL_SERVER_ERROR);

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
    @Param("id") id: string,
  ): Promise<Response<unknown>> {
    const slug = Service.lazyGetSlug(id);
    
    if (typeof slug !== "string")
      throw new HttpException(slug, HttpStatus.BAD_REQUEST);;

    const { successed } = Hash.parse(req);
    if (!successed)
      throw new HttpException(api.createError("Hash parse error"), HttpStatus.FORBIDDEN);

    this.cacheManager.del(`user-${slug}`);

    return this.service.deleteUser(slug);
  }

  private getUser(slug: string, cache: string) {
    const cacheManager = api.useCache<User>(this.cacheManager, cache);
    
    return cacheManager<[Partial<User> | string]>({
      key: `user-${slug}`,
      getFunction: this.service.getUser,
      data: [slug]
    });
  }
}
