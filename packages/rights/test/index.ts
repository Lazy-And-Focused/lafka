import { LAFka, Rights as LAFkaRights } from "@lafka/types";
import { Rights } from "../src/index";

const print = (str: string, end: boolean = false) =>
  console.log((end ? "\n" : "") + `-------------------------- ${str.toUpperCase()} --------------------------` + (end ? "" : "\n"));

const miniTest = (name: string, data: any, spaces: number = 0) => {
  const sp = new Array(spaces).fill(" ").join();

  console.log(sp + `---- ${name} ----`);
  console.log(sp + " ", data);
  console.log();
  
  return data;
}

const test = (name: string, func: () => any[]) => {
  print(name);
  func().forEach((v, i) => miniTest(`${i+1}`, v));
};

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
    ["2", LAFkaRights.Raw.Default.POSTS.toString()],
    ["3", LAFkaRights.Raw.Lazy.POSTS.toString()],
    ["4", 0n.toString()]
  ]
};

test("USER TESTING", () => {
  return [
    new Rights.UserService(fockusty).has({
      right: "me",
      rights: ["POSTS_CREATE", "MODERATOR"]
    }),

    new Rights.UserService(fockusty).has({
      right: "users",
      rights: {
        "2": ["MANAGE", "MODERATE", "READ"],
        "3": ["READ"],
        "4": ["READ"],
      }
    })
  ];
});

test("POST TESTING", () => {
  return [
    new Rights.PostService(post).has({
      rights: "VIEW",
      userId: fockusty.id
    }),
  
    new Rights.PostService(post).has({
      rights: "DELETE",
      userId: fockusty.id
    }),
  
    new Rights.PostService(post).has({
      rights: "OWNER",
      userId: "2"
    }),

    new Rights.PostService(post).has({
      rights: ["VIEW", "REACT", "COMMENTS_READ"],
      userId: "4"
    })
  ];
});

print("END TESTING", true);