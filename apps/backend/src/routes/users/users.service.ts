import { Injectable } from "@nestjs/common";

import { UpdateWriteOpResult } from "mongoose";

import { Models } from "lafka/database";
import type { LAFka } from "lafka/types";
import type { ServiceResponse } from "lafka/types/service.types";
import { DeleteResult } from "lafka/database/types/mongodb.types";

const { users } = new Models();
const keyGetSymbols = ["@"];
const keyGetSymbolsMap = new Map<string, string>([
  ["@", "username"],
  ["", "id"]
]);

type Utility<T extends boolean = false> = T extends true
  ? string | Error
  : { "id": string } | { "username": string } | Error

@Injectable()
export class UsersService {
  public static formatGetData<Lazy extends boolean = false>(
    data: string,
    format: Lazy
  ): Lazy extends true
      ? string | Error
      : { "id": string } | { "username": string } | Error {
    if (!keyGetSymbols.includes(data[0])) {
      if (isNaN(+data[0]))
        return new Error(`argument must be username (@username) or id (id)`);

      return format
        ? (data as Utility<Lazy>)
        : ({ "id": data } as Utility<Lazy>);
    }

    const type = keyGetSymbolsMap.get(data[0]) as "username" | "id";
    if (!type) return new Error(`argument must be username (@username) or id (id)`);

    return format
      ? (data.slice(1) as Utility<Lazy>)
      : ({ [type]: data.slice(1) } as Utility<Lazy>);
  }

  public static formatGettedData<Lazy extends boolean = false>(
    data: { "id": string } | { "username": string } | (Lazy extends true ? Error : never)
  ): Lazy extends true ? (string | false) : string {
    if (data instanceof Error) return false as (Lazy extends true ? (string | false) : string);

    const key = Object.keys(data)[0];
    return data[key];
  }

  public async getUser(data: Partial<LAFka.User> | string): Promise<ServiceResponse<LAFka.User>> {
    try {
      const user = (await users.model.findOne(typeof data === "string" ? { id: data } : data)).toObject();

      if (!user) return { successed: false, resource: null, error: "User not found" };

      return {
        successed: true,
        error: null,
        resource: user
      };
    } catch (error) {
      console.error(error);

      return {
        successed: false,
        resource: null,
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
        ? (await users.model.findOne({ id })).toObject() as any
        : (updated as T);

      if (!updated.acknowledged)
        return { successed: false, error: "unknown error: 1", resource: null };

      return {
        successed: true,
        error: null,
        resource: resource
      };
    } catch (error) {
      console.error(error);

      return {
        successed: false,
        resource: null,
        error
      };
    }
  }

  public async deleteUser<T extends DeleteResult | LAFka.User>(
    id: string,
    returnUser: T extends LAFka.User ? true : false
  ): Promise<ServiceResponse<T>> {
    try {
      const resource = returnUser ? users.getData({filter: {id}}) : null;
      const deleted = await users.delete({id});

      if (!deleted.acknowledged)
        return { successed: false, error: "unknown error: 2", resource: null };

      return {
        successed: true,
        error: null,
        resource: returnUser ? (deleted as T) : (resource as unknown as T)
      };
    } catch (error) {
      console.error(error);

      return {
        successed: false,
        resource: null,
        error
      };
    }
  }
}
