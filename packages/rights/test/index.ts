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
  rights: {
    me: LAFkaRights.Raw.Default.ME.toString(),
    users: [
      ["2", LAFkaRights.Raw.Lazy.USERS.toString()],
      ["3", LAFkaRights.Raw.Default.USERS.toString()],
      ["4", 0n.toString()]
    ]
  },
  username: "FOCKUSTY"
};

print("USER TESTING");
(() => {
  const a = new Rights.UserService(fockusty).has({
    right: "me",
    rights: ["POSTS_CREATE", "MODERATOR"]
  });
  
  const b = new Rights.UserService(fockusty).has({
    right: "users",
    rights: {
      "2": ["MANAGE", "MODERATE", "READ"],
      "3": ["READ"],
      "4": ["READ"],
    }
  });

  test(a);
  test(b);
})();

print("END TESTING", true);