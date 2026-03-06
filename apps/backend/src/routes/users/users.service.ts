import { Injectable } from "@nestjs/common";

import { UpdateWriteOpResult } from "mongoose";

import { Models } from "lafka/database";
import { DeleteResult } from "lafka/database/types/mongodb.types";
import { Response, User } from "lafka/types";

const { users } = new Models();
const keyGetSymbols = ["@"];
const keyGetSymbolsMap = new Map<string, string>([
  ["@", "username"],
  ["", "id"]
]);

const ERROR_BAD_SLUG = `argument must be username (@username) or id (id)` as const;

@Injectable()
export class Service {
  public static getSlugType(slug: string): "id"|"username"|Error {
    if (!keyGetSymbols.includes(slug[0])) {
      if (isNaN(+slug[0])) {
        return new Error(ERROR_BAD_SLUG);
      };

      return "id";
    };

    return keyGetSymbolsMap.get(slug[0]) as "username" | "id";
  }

  public static lazyGetSlug(slug: string): string | Response<User> {
    if (!keyGetSymbols.includes(slug[0])) {
      if (isNaN(+slug[0]))
        return {
          error: ERROR_BAD_SLUG,
          successed: false,
          data: null
        };

      return slug;
    }

    const type = keyGetSymbolsMap.get(slug[0]) as "username" | "id";
    if (!type) {
      return {
        successed: false,
        data: null,
        error: ERROR_BAD_SLUG,
      };
    };

    return slug.slice(1);
  }

  public static getSlug(
    slug: string
  ): ({ "id": string } | { "username": string }) | Response<User> {
    const slugType = Service.getSlugType(slug);

    if (slugType instanceof Error) {
      return {
        successed: false,
        data: null,
        error: slugType.message,
      }
    };

    return { [slugType]: this.lazyGetSlug(slug) } as ({ "id": string } | { "username": string }) | Response<User>;
  }

  public static formatGettedData<Lazy extends boolean = false>(
    data: { "id": string } | { "username": string } | (Lazy extends true ? Error : never)
  ): Lazy extends true ? (string | false) : string {
    if (data instanceof Error) return false as (Lazy extends true ? (string | false) : string);

    const key = Object.keys(data)[0];
    return data[key];
  }

  public async getUser(data: Partial<User> | string): Promise<Response<User>> {
    try {
      const user = (await users.model.findOne(typeof data === "string" ? { id: data } : data)).toObject();

      if (!user) return { successed: false, data: null, error: "User not found" };

      return {
        successed: true,
        error: null,
        data: user
      };
    } catch (error) {
      console.error(error);

      return {
        successed: false,
        data: null,
        error
      };
    }
  }

  public async followUser(follower: string, following: string): Promise<Response<unknown>> {
    try {
      const isFollow = !((await users.model.findOne({id: following})).toObject().followers.includes(follower));
      
      await users.model.updateOne({
        id: following
      }, isFollow ? {
        $push: {
          followers: follower
        }
      } : {
        $pull: {
          followers: follower
        }
      });

      await users.model.updateOne({
        id: follower
      }, isFollow ? {
        $push: {
          following
        }
      } : {
        $pull: {
          following
        }
      })

      return {
        data: null,
        successed: true,
        error: null
      }
    } catch (error) {
      return {
        successed: false,
        data: null,
        error
      }
    }
  };

  public async updateUser(
    id: string,
    data: Partial<User>,
  ): Promise<Response<UpdateWriteOpResult>> {
    try {
      const updated = await users.update({ filter: { id }, update: data });

      if (!updated.acknowledged)
        return { successed: false, error: "unknown error: 1", data: null };

      return {
        successed: true,
        error: null,
        data: updated
      };
    } catch (error) {
      console.error(error);

      return {
        successed: false,
        data: null,
        error
      };
    }
  }

  public async deleteUser(
    id: string,
  ): Promise<Response<DeleteResult>> {
    try {
      const deleted = await users.delete({id});

      if (!deleted.acknowledged)
        return { successed: false, error: "unknown error: 2", data: null };

      return {
        successed: true,
        error: null,
        data: deleted
      };
    } catch (error) {
      console.error(error);

      return {
        successed: false,
        data: null,
        error
      };
    }
  }
}
