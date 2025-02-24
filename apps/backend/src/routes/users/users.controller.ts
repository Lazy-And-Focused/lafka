import "lafka/types/authors/user.types";

import { Controller, Get, Injectable, Param } from "@nestjs/common";
import { UsersService } from "./users.service";

@Injectable()
@Controller("users")
export class UsersController {
    public constructor(private usersService: UsersService) {}

    @Get(":id")
    public async get(@Param("id") id: string) {
        const data = await this.usersService.getUser(id);

        return {
            ...data,
            type: "user"
        };
    }
};
