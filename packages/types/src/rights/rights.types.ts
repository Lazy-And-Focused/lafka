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
      "VIEWERS_BLOCK",
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
    export const ALL = [...EXCLUDE, "READ", "POSTS_READ"] as const;
    const builder = new BitBuilder(ALL);

    export const AVAILABLE: Organizations = builder.execute(Posts.AVAILABLE);
    export const DEFAULT: Organizations = builder.execute(
      Posts.AVAILABLE,
      Organizations.EXCLUDE,
    );
    export const RAW_AVAILABLE = builder.resolve(AVAILABLE);
    export const RAW_DEFAULT = builder.resolve(DEFAULT);
  }

  // ## { COMPILED__WRITE_COMPILED_HERE } ## \\

/**
 * - this file was auto genereted by compiler 
 * - if you see inconsistencies: https://github.com/FOCKUSTY/bit-field/issues 
 */
export const raw = {
  my: {
    /** @value 1 */
administrator: 1n << 0n,

    /** @value 2 */
moderator: 1n << 1n,

    /** @value 4 */
mute: 1n << 2n,

    /** @value 8 */
ban: 1n << 3n,

    /** @value 16 */
postsManage: 1n << 4n,

    /** @value 32 */
commentsManage: 1n << 5n,

    /** @value 64 */
organizationsManage: 1n << 6n,

    /** @value 128 */
postsDelete: 1n << 7n,

    /** @value 256 */
commentsDelete: 1n << 8n,

    /** @value 512 */
organizationsDelete: 1n << 9n,

    /** @value 1024 */
user: 1n << 10n,

    /** @value 2048 */
postsCreate: 1n << 11n,

    /** @value 4096 */
commentsCreate: 1n << 12n,

    /** @value 8192 */
organizationsCreate: 1n << 13n
  } as const,

  posts: {
    /** @value 16384 */
owner: 1n << 14n,

    /** @value 32768 */
manager: 1n << 15n,

    /** @value 65536 */
manage: 1n << 16n,

    /** @value 131072 */
delete: 1n << 17n,

    /** @value 262144 */
commentsDelete: 1n << 18n,

    /** @value 524288 */
commentsManage: 1n << 19n,

    /** @value 1048576 */
viewersMute: 1n << 20n,

    /** @value 2097152 */
viewersBlock: 1n << 21n,

    /** @value 4194304 */
view: 1n << 22n,

    /** @value 8388608 */
react: 1n << 23n,

    /** @value 16777216 */
attachFiles: 1n << 24n,

    /** @value 33554432 */
commentsRead: 1n << 25n,

    /** @value 67108864 */
commentsCreate: 1n << 26n,

    /** @value 134217728 */
commentsReact: 1n << 27n
  } as const,

  organizations: {
    /** @value 268435456 */
owner: 1n << 28n,

    /** @value 536870912 */
administrator: 1n << 29n,

    /** @value 1073741824 */
inviteCreate: 1n << 30n,

    /** @value 2147483648 */
rightsManage: 1n << 31n,

    /** @value 4294967296 */
manage: 1n << 32n,

    /** @value 8589934592 */
delete: 1n << 33n,

    /** @value 17179869184 */
postsCreate: 1n << 34n,

    /** @value 34359738368 */
postsManage: 1n << 35n,

    /** @value 68719476736 */
postsDelete: 1n << 36n,

    /** @value 137438953472 */
rolesManage: 1n << 37n,

    /** @value 274877906944 */
membersKick: 1n << 38n,

    /** @value 549755813888 */
viewersBlock: 1n << 39n,

    /** @value 1099511627776 */
read: 1n << 40n,

    /** @value 2199023255552 */
postsRead: 1n << 41n
  } as const
} as const;
// ## { COMPILED__WRITE_COMPILED_HERE } ## \\

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
      } as const,
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
      } as const,
    } as const,
  } as const;

  export type Keys = keyof typeof CONSTANTS.object.available;
  export type Rights<T extends Keys> =
    keyof (typeof CONSTANTS.object.available)[T];

  export namespace Raw {
    // ## { COMPILED__WRITE_EXPORT_HERE } ## \\

export type Keys = keyof typeof raw;
export type Raw<T extends Keys> = (typeof raw)[T];
export type RawKeys<T extends Keys> = keyof Raw<T>;
// ## { COMPILED__WRITE_EXPORT_HERE } ## \\
  }
}

const rights = Object.fromEntries(
  Object.keys(Rights.CONSTANTS.object.available).map((key) => [
    key,
    Object.keys(Rights.CONSTANTS.object.available[key]),
  ]),
);

if (process.env.NODE_ENV === "rights_compile")
  new Compiler(
    rights,
    __dirname + "\\rights.types.ts",
    {},
    {
      writeInCompiler: true,
      defaultExportOn: false,
      name: "raw",
    },
  ).execute();
