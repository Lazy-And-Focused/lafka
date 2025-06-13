import { LAFka, Rights as LAFkaRights } from "@lafka/types";

export const user: LAFka.User = {
  blocked_posts: [],
  blog_posts: [],
  created_at: new Date().toISOString(),
  followed_blog_posts: [],
  followed_forum_posts: [],
  followers: [],
  following: [],
  forum_posts: [],
  id: "1",
  links: [],
  rights: LAFkaRights.Constants.RIGHTS.RAW.DEFAULT.My.toString(),
  username: "FOCKUSTY"
};

export const post: LAFka.Post = {
  type: "forum",
  id: "1",
  created_at: new Date().toISOString(),
  comments: [],
  content: "Hello!",
  creator_id: user.id,
  followers: 0,
  name: "First post",
  status: "open",
  tags: [],
  rights: new Map<string, string>([
    ["1", LAFkaRights.Constants.RIGHTS.RAW.DEFAULT.Posts.toString()],
    ["4", LAFkaRights.Constants.RIGHTS.RAW.DEFAULT.Posts.toString()],
    ["2", LAFkaRights.Constants.RIGHTS.RAW.AVAILABLE.Posts.toString()],
    ["3", 0n.toString()]
  ])
};

export const organization: LAFka.Organization = {
  creator_id: user.id,
  id: "1",
  members: ["1", "2", "3"],
  owner_id: user.id,
  rights: new Map<string, string>([
    ["4", LAFkaRights.Constants.Organizations.DEFAULT.toString()],
    ["1", LAFkaRights.Constants.Organizations.DEFAULT.toString()],
    ["2", LAFkaRights.Constants.Organizations.AVAILABLE.toString()],
    ["3", 0n.toString()],
  ]),
  name: "",
  description: "",
  email: "",
  logo: "",
  banner: "",
  posts: [],
  links: []
};