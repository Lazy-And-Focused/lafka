import { Request } from "express";

import { Models } from "lafka/database";
import { AuthUser } from "lafka/types/auth/auth-user.types";

const { auth_users, users } = new Models();

class Service {
  public async validateRequest(req: Request) {
    const user = req.user as AuthUser;
    if (!user) return false;

    const findedUser = await auth_users.model.findOne({ id: user.id });

    if (!findedUser) return false;
    if (user.access_token !== findedUser.access_token) return false;

    const profileUser = await users.model.findOne({ id: user.id });

    if (!profileUser) return false;

    return true;
  }
}

export default Service;
