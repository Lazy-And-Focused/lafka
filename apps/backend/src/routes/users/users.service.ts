import { Injectable } from "@nestjs/common";

import Database from "lafka/database/database/models.database";

import type { User } from "lafka/types/authors/user.types";
import type { ServiceResponse } from "lafka/types/service.types";

const { users } = Database;

@Injectable()
export class UsersService {
    public async getUser(data: Partial<User>|string): Promise<ServiceResponse<User>> {
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
