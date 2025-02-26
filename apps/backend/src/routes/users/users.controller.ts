import "lafka/types/authors/user.types";

import { Controller, Get, Injectable, Param, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuard } from "guards/auth/auth.guard";

@Injectable()
@Controller("users")
@UseGuards(AuthGuard)
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
