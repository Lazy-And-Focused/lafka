import type { Request } from "express";

import { Injectable } from "@nestjs/common";

import { HashService } from "@1/services/hash.service";
import { PrismaService } from "@/database";
import { AUTH_ERRORS } from "@1/errors/guards/auth.errors";

@Injectable()
export class AuthGuardService {
  public constructor(private readonly prisma: PrismaService) {}

  public async validateRequest(req: Request) {
    const { authId, token, userId } =
      HashService.resolveHeaderAuthorizationOrThrow(req.headers.authorization);

    const auth = await this.prisma.auth.findUnique({
      where: {
        id: authId,
      },
    });

    if (!auth) {
      throw AUTH_ERRORS.USER_NOT_FOUND.execute();
    }

    if (auth.userId !== userId) {
      throw AUTH_ERRORS.PROFILE_ID.execute();
    }

    if (token !== auth.token) {
      throw AUTH_ERRORS.TOKEN_ERROR.execute();
    }

    const user = this.prisma.user.findUnique({
      where: {
        id: auth.userId,
      },
    });

    if (!user) {
      throw AUTH_ERRORS.PROFILE_NOT_FOUND.execute();
    }

    return true;
  }
}

export default AuthGuardService;
