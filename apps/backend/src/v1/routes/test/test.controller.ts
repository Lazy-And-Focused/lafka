import { Public } from "@/decorators";
import { AuthGuard } from "@1/guards";

import { Controller, Injectable, Get, UseGuards } from "@nestjs/common";

import { ApiOperation } from "@nestjs/swagger";

import { SkipThrottle } from "@nestjs/throttler";
import { CacheTTL } from "@nestjs/cache-manager";

import { OPERATIONS, ROUTE, ROUTES } from "./test.routes";

@Injectable()
@Controller(ROUTE)
@UseGuards(AuthGuard)
export class TestController {
  public constructor() {}

  @Get(ROUTES.GET)
  @ApiOperation(OPERATIONS.GET)
  public get() {
    return "Hi from guarded test";
  }

  @Get(ROUTES.GET_PUBLIC)
  @ApiOperation(OPERATIONS.GET_PUBLIC)
  @Public()
  public getPublic() {
    return "Hi from public test";
  }

  @Get(ROUTES.GET_TOO_MANY_REQUESTS_NON_PROTECTED)
  @ApiOperation(OPERATIONS.GET_TOO_MANY_REQUESTS_NON_PROTECTED)
  @SkipThrottle()
  @CacheTTL(1)
  @Public()
  public getTooManyRequestsNonProtected() {
    return "Hi from too many requests non protected test";
  }
}
