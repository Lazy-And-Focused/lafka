import "lafka/types/authors/user.types";

import { Controller, Get, Injectable, Param, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuard } from "guards/auth/auth.guard";

const starts = /username|id/;

@Injectable()
@Controller("users")
@UseGuards(AuthGuard)
export class UsersController {
    public constructor(private usersService: UsersService) {}

    @Get(":data")
    public async get(@Param("data") data: string) {
        const matchs = data.match(starts);
        const d = matchs
            ? {[matchs[0]]: data.split("-")[1]}
            : { id: data };

        const res = await this.usersService.getUser(d);

        return {
            ...res,
            type: "user"
        };
    }
};
