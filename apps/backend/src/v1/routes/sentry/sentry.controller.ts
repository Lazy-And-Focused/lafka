import {
  Controller,
  Get,
  Injectable,
  HttpException,
  Query,
  HttpStatus,
  ParseIntPipe,
} from "@nestjs/common";

import { ROUTE, ROUTES, OPERATIONS } from "./sentry.routes";

import { Queries } from "@/v1/enums";
import { logger } from "@sentry/nestjs";
import { ApiOperation } from "@nestjs/swagger";

@Injectable()
@Controller(ROUTE)
export class SentryController {
  @Get(ROUTES.GET)
  @ApiOperation(OPERATIONS.GET)
  public get() {
    logger.info("Hello", { string: "World" });

    return "Hello, World!";
  }

  @Get(ROUTES.GET_ERROR)
  @ApiOperation(OPERATIONS.GET_ERROR)
  public getError() {
    throw new Error("Test error for sentry");
  }

  @Get(ROUTES.GET_HTTP)
  @ApiOperation(OPERATIONS.GET_HTTP)
  public getHttp(@Query(Queries.status, ParseIntPipe) status?: number) {
    if (!status) {
      throw new HttpException("Not found TEST", HttpStatus.NOT_FOUND);
    }

    throw new HttpException("Exсeption TEST", status);
  }
}

export default SentryController;
