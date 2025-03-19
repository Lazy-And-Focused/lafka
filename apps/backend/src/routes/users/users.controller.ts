import "lafka/types/authors/user.types";

import { Controller, Get, Injectable, Param, Req, Res, UseGuards } from "@nestjs/common";
import { Request, Response } from "express";
import { UsersService } from "./users.service";
import { AuthGuard } from "guards/auth/auth.guard";
import { Public } from "decorators/public.decorator";

import { USERS_ROUTES, USERS_CONTROLLER } from "./users.routes";
import Hash from "api/hash.api";

@Injectable()
@Controller(USERS_CONTROLLER)
@UseGuards(AuthGuard)
export class UsersController {
  public constructor(private usersService: UsersService) {}

  @Get(USERS_ROUTES.GET_ME)
  public async getMe(@Req() req: Request, @Res() res: Response) {
    const { successed, profile_id } = Hash.parse(req);

    if (!successed) return res.send({successed: false, type: "user"});

    const user = await this.usersService.getUser(profile_id);

    return res.send({...user, type: "user" });
  }
  
  @Get(USERS_ROUTES.GET)
  @Public()
  public async get(@Param("data") data: string) {
    const formatted = UsersService.formatGetData(data);

    if (formatted instanceof Error) return { error: formatted.message };

    const res = await this.usersService.getUser(formatted);

    return {
      ...res,
      type: "user"
    };
  }
}
