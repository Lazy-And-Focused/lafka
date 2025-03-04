import { Injectable } from "@nestjs/common";

import { Models } from "lafka/database";
import type { LAFka } from "lafka/types";
import type { ServiceResponse } from "lafka/types/service.types";

const { users } = new Models();

const keyGetSymbols = ["@"];
const keyGetSymbolsMap = new Map<string, string>([
    ["@", "username"],
    ["", "id"]
]);

@Injectable()
export class UsersService {
    public static formatGetData(data: string) {
        if (!keyGetSymbols.includes(data[0])) {
            if (isNaN(+data[0]))
                return new Error(`argument must be username (@username) or id (id)`);

            return {"id": data}
        };

        const type = keyGetSymbolsMap.get(data[0]);

        if (!type) return new Error(`argument must be username (@username) or id (id)`);

        return { [type]: data.slice(1) };
    }

    public async getUser(data: Partial<LAFka.User>|string): Promise<ServiceResponse<LAFka.User>> {
        try {
            const user = await users.model.findOne(typeof data === "string" ? {id: data} : data);

            if (!user)
                return { successed: false, error: "User not found" };

            return {
                successed: true,
                resource: user
            };
        } catch (error) {
            console.error(error);

            return {
                successed: false,
                error
            } 
        }
    }
};
