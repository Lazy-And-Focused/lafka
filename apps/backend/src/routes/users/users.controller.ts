import "lafka/types/authors/user.types";

import { Controller, Get, Injectable, Param, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuard } from "guards/auth/auth.guard";
import { Public } from "decorators/public.decorator";

import { USERS_ROUTES, USERS_CONTROLLER } from "./users.routes";

@Injectable()
@Controller(USERS_CONTROLLER)
@UseGuards(AuthGuard)
export class UsersController {
  public constructor(private usersService: UsersService) {}

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
