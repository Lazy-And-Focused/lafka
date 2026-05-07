import type {
  ServiceCredentials,
  SignUpByPasswordData,
  SignUpData,
} from "@1/entities";

import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { sign } from "jsonwebtoken";

import { AUTH_STRATEGIES_ERRORS } from "../errors";

import { UsernamePipe } from "@1/pipes";
import { HashService } from "@1/services";
import { PrismaService } from "@/database";
import { env } from "@/services";

import { v4 as uuid } from "uuid";

@Injectable()
export class AuthStrategy {
  private readonly hash = new HashService();

  public constructor(private readonly prisma: PrismaService) {}

  public signUpByPassword({
    username,
    password,
    email,
    nickname,
  }: SignUpByPasswordData) {
    const hash = this.hash.execute(password);

    return this.signUp({
      username: username,
      nickname: nickname || username,
      email,
      password: hash,
    });
  }

  public async signUpByService({
    profile,
    accessToken,
    refreshToken,
    name,
  }: ServiceCredentials) {
    const profileUsername = (
      profile.username || profile.displayName
    ).toLowerCase();
    const nickname = profile.displayName;
    const username = (await this.prisma.user.findUnique({
      where: { username: profileUsername },
      select: { username: true },
    }))
      ? uuid()
      : profileUsername;

    return this.signUp({
      username,
      nickname,
      service: {
        id: profile.id,
        name: name,
        accessToken,
        refreshToken,
      },
    });
  }

  public async signInByPassword({ password, username }: SignUpByPasswordData) {
    const user = await this.prisma.user.findUnique({
      where: { username: UsernamePipe.validate(username.toLowerCase()) },
    });

    if (!user) {
      throw AUTH_STRATEGIES_ERRORS.USER_NOT_FOUND.execute({
        key: "username",
        value: username,
      });
    }

    const auth = await this.prisma.auth.findUnique({
      where: { userId: user.id },
    });

    if (!auth) {
      throw AUTH_STRATEGIES_ERRORS.AUTH_NOT_FOUND.execute({
        key: "userId",
        value: user.id,
      });
    }

    if (auth.password !== this.hash.execute(password)) {
      throw AUTH_STRATEGIES_ERRORS.PASSWORD_ERROR.execute();
    }

    return { user, auth };
  }

  public async signInByService({
    profile,
    accessToken,
    refreshToken,
    name,
  }: ServiceCredentials) {
    const service = await this.prisma.service.findUnique({
      where: {
        id: profile.id,
        name,
      },
    });

    if (!service) {
      return null;
    }

    const auth = await this.prisma.auth.findUnique({
      where: {
        id: service.authId,
      },
    });

    if (!auth) {
      throw AUTH_STRATEGIES_ERRORS.AUTH_NOT_FOUND.execute({
        key: "id",
        value: service.authId,
      });
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: auth.userId,
      },
    });

    if (!user) {
      throw AUTH_STRATEGIES_ERRORS.USER_NOT_FOUND.execute({
        key: "id",
        value: auth.userId,
      });
    }

    const update = {
      where: {
        id: service.id,
      },
      data: {
        accessToken,
        refreshToken,
      },
    };

    const updatedAuth = await this.prisma.auth.update({
      where: {
        id: auth.id,
      },
      data: {
        services: { update },
      },
    });

    return {
      auth: updatedAuth,
      user,
    };
  }

  protected async signUp({
    username,
    email,
    nickname,
    password,
    service,
  }: SignUpData) {
    const existedUser = await this.prisma.user.findUnique({
      where: {
        username: UsernamePipe.validate(username),
      },
    });

    if (existedUser) {
      throw new HttpException(
        `User with username "${username}" is exists`,
        HttpStatus.CONFLICT,
      );
    }

    const id = uuid();
    const userId = uuid();
    const authData = {
      id,
      userId,
    };

    const passwordData = password
      ? {
          password: password,
        }
      : {};

    const token = sign(authData, env.HASH_KEY, {
      expiresIn: env.TOKEN_EXPIRATION,
    });

    const [auth, user] = await this.prisma.$transaction([
      this.prisma.auth.create({
        data: {
          ...authData,
          ...passwordData,
          token,
          email,
          services: { create: service },
        },
      }),

      this.prisma.user.create({
        data: {
          id: userId,
          nickname: nickname || username,
          username: UsernamePipe.validate(username.toLowerCase()),
        },
      }),
    ]);

    return {
      auth,
      user,
      token,
    };
  }
}

export default AuthStrategy;
