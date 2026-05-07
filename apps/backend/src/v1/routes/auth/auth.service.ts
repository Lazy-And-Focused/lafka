import type { SignUpByPasswordData } from "@1/entities";
import type { Auth } from "@1/entities";

import { Injectable } from "@nestjs/common";

import { AuthStrategy, PassportStrategy } from "@1/strategies";
import { PrismaService } from "@/database";

import { env } from "@/services";

const toStringJson = (value: unknown) => {
  return JSON.stringify(value, undefined, 4);
};

@Injectable()
export class AuthService {
  public constructor(
    private readonly prisma: PrismaService,
    private readonly strategy: AuthStrategy,
  ) {}

  public getAllMethods() {
    const { abbreviations, methods } = PassportStrategy.methods;

    return {
      stringMethods: toStringJson(methods),
      stringAbbreviations: toStringJson(abbreviations),
      abbreviations,
      methods,
    };
  }

  public async getMe(authId: string, userId: string) {
    const auth = await this.prisma.auth.findUnique({
      where: { id: authId },
    });
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    return { auth, user };
  }

  public async createUser(data: SignUpByPasswordData) {
    return this.strategy.signUpByPassword(data);
  }

  public getRedirectUrl(auth: Auth) {
    const url = new URL(env.CLIENT_URL);
    url.searchParams.append("token", auth.token);
    return url.href;
  }
}

export default AuthService;
