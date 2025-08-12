import { Rights as LAFkaRights, Organization, Post, User } from "@lafka/types";

export const user: User = {
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
  rights: LAFkaRights.CONSTANTS.raw.default.my.toString(),
  username: "FOCKUSTY"
};

export const post: Post = {
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
    ["1", LAFkaRights.CONSTANTS.raw.default.posts.toString()],
    ["4", LAFkaRights.CONSTANTS.raw.default.posts.toString()],
    ["2", LAFkaRights.CONSTANTS.raw.available.posts.toString()],
    ["3", 0n.toString()]
  ])
};

export const organization: Organization = {
  owner_id: user.id,
  id: "1",
  tags: [],
  members: ["1", "2", "3"],
  rights: new Map<string, string>([
    ["4", LAFkaRights.CONSTANTS.raw.default.organizations.toString()],
    ["1", LAFkaRights.CONSTANTS.raw.default.organizations.toString()],
    ["2", LAFkaRights.CONSTANTS.raw.available.organizations.toString()],
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