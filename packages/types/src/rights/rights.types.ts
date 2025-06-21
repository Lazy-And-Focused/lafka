import { BitBuilder } from "fbit-field";
import { Compiler } from "fbit-field/compiler";
import { writeFileSync } from "fs";
import { parse } from "path";

type IRights<T extends any[] | readonly any[]> = Record<T[number], bigint>;
export namespace Rights {
  export type My = IRights<typeof My.ALL>;
  export namespace My {
    export const EXCLUDE = [
      "ADMINISTRATOR",
      "MODERATOR",
      "MUTE",
      "BAN",
      "POSTS_MANAGE",
      "COMMENTS_MANAGE",
      "ORGANIZATIONS_MANAGE",
      "POSTS_DELETE",
      "COMMENTS_DELETE",
      "ORGANIZATIONS_DELETE",
    ] as const;
    export const ALL = [
      ...EXCLUDE,
      "USER",
      "POSTS_CREATE",
      "COMMENTS_CREATE",
      "ORGANIZATIONS_CREATE",
    ] as const;
    const builder = new BitBuilder(ALL);

    export const AVAILABLE: My = builder.execute(0n);
    export const DEFAULT: My = builder.execute(0n, My.EXCLUDE);
    export const RAW_AVAILABLE = builder.resolve(AVAILABLE);
    export const RAW_DEFAULT = builder.resolve(DEFAULT);
  }

  export type Posts = IRights<typeof Posts.ALL>;
  export namespace Posts {
    export const EXCLUDE = [
      "OWNER",
      "MANAGER",
      "MANAGE",
      "DELETE",
      "COMMENTS_DELETE",
      "COMMENTS_MANAGE",
      "VIEWERS_MUTE",
      "VIEWERS_BLOCK"
    ] as const;
    export const ALL = [
      ...EXCLUDE,
      "VIEW",
      "REACT",
      "ATTACH_FILES",
      "COMMENTS_READ",
      "COMMENTS_CREATE",
      "COMMENTS_REACT",
    ] as const;
    const builder = new BitBuilder(ALL);
    export const AVAILABLE: Posts = builder.execute(My.AVAILABLE);
    export const DEFAULT: Posts = builder.execute(My.AVAILABLE, Posts.EXCLUDE);
    export const RAW_AVAILABLE = builder.resolve(AVAILABLE);
    export const RAW_DEFAULT = builder.resolve(DEFAULT);
  }

  export type Organizations = IRights<typeof Organizations.ALL>;
  export namespace Organizations {
    export const EXCLUDE = [
      "OWNER",
      "ADMINISTRATOR",
      "INVITE_CREATE",
      "RIGHTS_MANAGE",
      "MANAGE",
      "DELETE",
      "POSTS_CREATE",
      "POSTS_MANAGE",
      "POSTS_DELETE",
      "ROLES_MANAGE",
      "MEMBERS_KICK",
      "VIEWERS_BLOCK",
    ] as const;
    export const ALL = [
      ...EXCLUDE,
      "READ",
      "POSTS_READ",
    ] as const;
    const builder = new BitBuilder(ALL);
   
    export const AVAILABLE: Organizations = builder.execute(Posts.AVAILABLE);
    export const DEFAULT: Organizations = builder.execute(Posts.AVAILABLE, Organizations.EXCLUDE);
    export const RAW_AVAILABLE = builder.resolve(AVAILABLE);
    export const RAW_DEFAULT = builder.resolve(DEFAULT);
  }

  export const CONSTANTS = {
    raw: {
      default: {
        my: My.RAW_DEFAULT,
        posts: Posts.RAW_DEFAULT,
        organizations: Organizations.RAW_DEFAULT,
      } as const,

      available: {
        my: My.RAW_AVAILABLE,
        posts: Posts.RAW_AVAILABLE,
        organizations: Organizations.RAW_AVAILABLE,
      } as const
    } as const,

    object: {
      default: {
        my: My.DEFAULT,
        posts: Posts.DEFAULT,
        organizations: Organizations.DEFAULT,
      } as const,

      available: {
        my: My.AVAILABLE,
        posts: Posts.AVAILABLE,
        organizations: Organizations.AVAILABLE,
      } as const
    } as const
  } as const;
};

const rights = Object.fromEntries(
  Object.keys(Rights.CONSTANTS.object.available).map((key) => [
    key,
    Object.keys(Rights.CONSTANTS.object.available[key])
  ])
);

if (process.env.NODE_ENV === "rights_compile")
  new Compiler(
    rights,
    __dirname + "\\rights-compiled.types.ts",
    {
      writeFile(me) {
        const data = JSON.stringify(this.compile(me), undefined, 2)
          .replaceAll('"', "")
          .replaceAll("}", "} as const")
          .replaceAll("'\\n'", "\n")
          .replaceAll("as const,", "as const,\n")
          .replaceAll("n,", "n,\n");

        const file =
          "\n/**" +
          `\n * - this file was auto genereted by ${parse(__filename).name} ` +
          "\n * - if you see inconsistencies: https://github.com/Lazy-And-Focused/lafka/issues " +
          "\n */" +
          `\nexport const rights = ${data};` +
          "\n" +
          "\nexport type Keys = keyof typeof rights;" +
          "\nexport type Rights<T extends Keys> = (typeof rights)[T];" +
          "\nexport type RightsKeys<T extends Keys> = keyof Rights<T>;" +
          "\n\nexport default rights;\n";

        writeFileSync(this.filePath, file, "utf-8");

        return file;
      },
    }
  ).execute();