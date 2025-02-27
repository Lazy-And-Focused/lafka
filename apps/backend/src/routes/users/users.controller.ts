import "lafka/types/authors/user.types";

import { Controller, Get, Injectable, Param, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuard } from "guards/auth/auth.guard";

@Injectable()
@Controller("users")
@UseGuards(AuthGuard)
export class UsersController {
    public constructor(private usersService: UsersService) {}

    @Get(":data")
    public async get(@Param("data") data: string) {
        const formatted = UsersService.formatGetData(data);

        if (formatted instanceof Error) return {error: formatted.message};

        const res = await this.usersService.getUser(formatted);

        return {
            ...res,
            type: "user"
        };
    }
};
