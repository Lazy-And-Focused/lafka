import { Request } from "express";

import { Models } from "lafka/database";
import Hash from "api/hash.api";

const { auth_users, users } = new Models();

class Service {
  public async validateRequest(req: Request) {
    const { successed, id, token } = Hash.parse(req);

    if (!successed) return false;

    const findedUser = await auth_users.model.findOne({ id: id });

    if (!findedUser) return false;
    if (token !== new Hash().execute(findedUser.access_token)) return false;

    const profileUser = await users.model.findOne({ id: findedUser.profile_id });

    if (!profileUser) return false;

    return true;
  }
}

export default Service;
