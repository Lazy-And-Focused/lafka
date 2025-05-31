import { LAFka, Rights as LAFkaRights } from "@lafka/types";
import { Rights } from "../src/index";

const print = (str: string, end: boolean = false) =>
  console.log((end ? "\n" : "") + `-------------------------- ${str.toUpperCase()} --------------------------` + (end ? "" : "\n"));

const test = (b: any, name?: string) =>
  name
    ? console.log(`--------- TESTING ${name.toUpperCase()} ---------`, "\n", b, "\n", `--------- TESTING ${name.toUpperCase()} ---------`)
    : console.log(`--------- TESTING ---------`, "\n", b, "\n", `--------- TESTING ---------`);

print("START TESTING");

const fockusty: LAFka.User = {
  blocked_posts: [],
  blog_posts: [],
  created_at: new Date(),
  followed_blog_posts: [],
  followed_forum_posts: [],
  followers: [],
  following: [],
  forum_posts: [],
  id: "1",
  links: [],
  rights: LAFkaRights.Constants.My.DEFAULT.toString(),
  username: "FOCKUSTY"
};

const post: LAFka.Post = {
  type: "forum",
  id: "1",
  created_at: new Date(),
  comments: [],
  content: "Hello!",
  creator_id: fockusty.id,
  followers: 0,
  name: "First post",
  status: "open",
  tags: [],
  view_status: 1,
  rights: [
    ["1", LAFkaRights.Constants.Posts.DEFAULT.toString()],
    ["2", LAFkaRights.Constants.Posts.AVAILABLE.toString()],
    ["3", 0n.toString()]
  ]
};

print("USER TESTING");
(() => {
  const a = new Rights.UserService(fockusty).has(["POSTS_CREATE", "MODERATOR"]); 
  const b = new Rights.UserService(fockusty).has(["ADMINISTRATOR"]); 
  const c = new Rights.UserService(fockusty).has(["COMMENTS_CREATE"]); 
  
  test(a);
  test(b);
  test(c);
})();

print("END TESTING", true);