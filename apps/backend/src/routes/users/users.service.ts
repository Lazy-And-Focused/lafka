import { Injectable } from "@nestjs/common";

import { UpdateWriteOpResult } from "mongoose";

import DB, { Models } from "lafka/database";
import type { LAFka } from "lafka/types";
import type { ServiceResponse } from "lafka/types/service.types";
import { DeleteResult } from "lafka/database/types/mongodb.types";

const { users } = new Models();
const keyGetSymbols = ["@"];
const keyGetSymbolsMap = new Map<string, string>([
  ["@", "username"],
  ["", "id"]
]);

@Injectable()
export class UsersService {
  public static formatGetData<Lazy extends boolean = false>(
    data: string,
    format: Lazy
  ): Lazy extends true ? string | Error : { "id": string } | { "username": string } | Error {
    if (!keyGetSymbols.includes(data[0])) {
      if (isNaN(+data[0]))
        return new Error(`argument must be username (@username) or id (id)`) as any;

      return format ? (data as any) : ({ "id": data } as any);
    }

    const type = keyGetSymbolsMap.get(data[0]) as "username" | "id";

    if (!type) return new Error(`argument must be username (@username) or id (id)`) as any;

    return format
      ? (data.slice(1) as any)
      : ({ [type]: data.slice(1) } as { "id": string } | { "username": string } as any);
  }

  public static formatGettedData<Lazy extends boolean = false>(
    data: { "id": string } | { "username": string } | (Lazy extends true ? Error : never)
  ): Lazy extends true ? string | false : string {
    if (data instanceof Error) return false as any;

    const key = Object.keys(data)[0];
    return data[key];
  }

  public async getUser(data: Partial<LAFka.User> | string): Promise<ServiceResponse<LAFka.User>> {
    try {
      const user = await users.model.findOne(typeof data === "string" ? { id: data } : data);

      if (!user) return { successed: false, error: "User not found" };

      return {
        successed: true,
        resource: DB.Database.parse<LAFka.User>(user, "users")
      };
    } catch (error) {
      console.error(error);

      return {
        successed: false,
        error
      };
    }
  }

  public async updateUser<T extends UpdateWriteOpResult | LAFka.User>(
    id: string,
    data: Partial<LAFka.User>,
    returnUser: T extends LAFka.User ? true : false
  ): Promise<ServiceResponse<T>> {
    try {
      const updated = await users.update({ filter: { id }, update: data });

      const resource: T = returnUser
        ? (DB.Database.parse<LAFka.User>(await users.model.findOne({ id }), "users") as T)
        : (updated as T);

      return {
        successed: updated.acknowledged,
        resource: resource
      };
    } catch (error) {
      console.error(error);

      return {
        successed: false,
        error
      };
    }
  }

  public async deleteUser<T extends DeleteResult | LAFka.User>(
    id: string,
    returnUser: T extends LAFka.User ? true : false
  ): Promise<ServiceResponse<T>> {
    try {
      const resource = returnUser ? new DB.User<true>({ id }) : DB.User;

      const deleted = await resource.delete(id);

      return {
        successed: deleted.user.acknowledged && deleted.auth_user.acknowledged,
        resource: returnUser ? (deleted.user as T) : (resource as unknown as T)
      };
    } catch (error) {
      console.error(error);

      return {
        successed: false,
        error
      };
    }
  }
}
