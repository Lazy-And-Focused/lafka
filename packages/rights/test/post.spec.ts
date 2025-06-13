import { LAFka, Rights as LAFkaRights } from "@lafka/types";
import { Rights } from "../src/index";

import { user, post } from "./constants";
import Test from "./test.class";

const rightService = new Rights.PostService(post);

new Test("Post test", [
  {
    must: true,
    name: "Owner rights",
    returned: rightService.hasRights(["OWNER"])(user.id)
  },
  {
    must: false,
    name: "Block user",
    returned: rightService.hasRights(["COMMENTS_CREATE", "ATTACH_FILES", "VIEWERS_MUTE", "REACT"])("3")
  },
  {
    must: true,
    name: "Manager rights",
    returned: rightService.userHas("2")("MANAGER"),
  }
]).execute();