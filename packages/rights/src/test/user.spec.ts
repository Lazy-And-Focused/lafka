import { Rights } from "../index";

import { user } from "./constants";
import Test from "./test.class";

new Test("User test", [
  {
    must: false,
    returned: new Rights.UserService(user).has("ADMINISTRATOR"),
    log: ["ADMINISTRATOR"],
    name: "Adminstrator rights"
  },
  {
    must: true,
    returned: new Rights.UserService(user).has("USER", "POSTS_CREATE", "ORGANIZATIONS_CREATE"),
    log: ["USER", "POSTS_CREATE", "ORGANIZATIONS_CREATE"],
    name: "Standar user rights"
  }
]).execute();