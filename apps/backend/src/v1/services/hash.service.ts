import { HttpException, HttpStatus, Injectable } from "@nestjs/common";

import { HASH_ERRORS } from "@1/errors";

import { tryCatchThrow } from "@/utils";
import { env } from "@/services";

import { verify } from "jsonwebtoken";
import { createHmac } from "crypto";

const PARSE_ERROR = {
  id: false,
  profile_id: false,
  token: false,
  succeeded: false,
} as const;

type ParsedToken = {
  authId: string;
  userId: string;
  token: string;
  succeeded: true;
};

type ParseReturn = ParsedToken | typeof PARSE_ERROR;

@Injectable()
export class HashService {
  public static execute(data: string) {
    return new HashService().execute(data);
  }

  public static resolveTokenOrThrow(token: string): ParsedToken {
    return tryCatchThrow(
      (): ParsedToken => {
        const payload = verify(token, env.HASH_KEY);
        if (typeof payload === "string") {
          throw HASH_ERRORS.INVALID_TOKEN.execute();
        }

        const { id, userId } = payload;
        if (!id || !userId) {
          throw HASH_ERRORS.INVALID_TOKEN.execute();
        }

        return {
          authId: id,
          userId,
          token: token,
          succeeded: true,
        };
      },
      (error) => {
        if (error instanceof Error) {
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST, {
            cause: error.cause,
          });
        }
      },
    );
  }

  public static resolveHeaderAuthorizationOrThrow(
    authorization?: string,
  ): ParsedToken {
    if (!authorization) {
      throw HASH_ERRORS.AUTHORIZATION_UNDEFINED.execute();
    }

    return tryCatchThrow(() => {
      const [method, ...tokenData] = authorization.split(" ");
      const token = tokenData.join(" ");

      if (method === "Bearer") {
        return this.resolveTokenOrThrow(token);
      }

      throw HASH_ERRORS.TOKEN_METHOD_NOT_ACCEPTABLE.execute();
    });
  }

  public static resolveToken(token: string): ParseReturn {
    try {
      return this.resolveTokenOrThrow(token);
    } catch {
      return PARSE_ERROR;
    }
  }

  public static resolveHeaderAuthorization(
    authorization?: string,
  ): ParseReturn {
    try {
      return this.resolveHeaderAuthorizationOrThrow(authorization);
    } catch {
      return PARSE_ERROR;
    }
  }

  public constructor() {}

  public execute(data: string) {
    return createHmac("sha512", env.HASH_KEY).update(data).digest("hex");
  }

  public generateCode(data: string = (Math.random() * 1000).toString()) {
    return createHmac("sha512", env.HASH_KEY)
      .update(new Date().getTime().toString() + data)
      .digest("base64");
  }

  public resolveTokenOrThrow(token: string): ParsedToken {
    return HashService.resolveTokenOrThrow(token);
  }

  public resolveHeaderAuthorizationOrThrow(
    authorization?: string,
  ): ParsedToken {
    return HashService.resolveHeaderAuthorizationOrThrow(authorization);
  }

  public resolveToken(token: string): ParseReturn {
    return HashService.resolveToken(token);
  }

  public resolveHeaderAuthorization(authorization?: string) {
    return HashService.resolveHeaderAuthorization(authorization);
  }
}

export default HashService;
