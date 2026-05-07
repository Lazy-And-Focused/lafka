import type { Request, Response, NextFunction } from "express";

import { Injectable, NestMiddleware } from "@nestjs/common";
import { LoggerService } from "@/services";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  public constructor(private readonly logger: LoggerService) {}

  public use(request: Request, _res: Response, next: NextFunction) {
    this.logger.execute(`Request to ${request.url}`);
    next();
  }
}

export default LoggerMiddleware;
