import { LAFka, Rights as RightsTypes } from "lafka/types";
import User from "./user.class";

import { Rights } from "@lafka/rights";

class RightsService {
  private _user: LAFka.User;

  public constructor(user: string | LAFka.User) {
    this._user = typeof user === "string"
      ? {
        id: user,
        username: "",
        created_at: new Date().toISOString(),
        blocked_posts: [],
        blog_posts: [],
        followed_blog_posts: [],
        followed_forum_posts: [],
        followers: [],
        following: [],
        forum_posts: [],
        links: [],
        avatar: undefined,
        nickname: undefined,
        biography: undefined,
        rights: {
          me: `${RightsTypes.Raw.Default.ME}`,
          users: []
        }
      }
      : user;
  }

  public async init(): Promise<this> {
    this._user = this._user.username === ""
      ? await new User<true>({id: this._user.id}).init() || this._user
      : this._user;

    if (this._user.username === "") throw new Error("user not found");

    return this;
  }
}

export default RightsService;
