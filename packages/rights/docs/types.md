```ts
const Rights = {
  RAW: 135184372088831n,

  RAW_ME: 16383n,
  RAW_USERS: 114688n,
  RAW_POSTS: 2147352576n,
  RAW_ORGANIZATIONS: 35182224605184n,

  ME: {
    ADMINISTRATOR:         /* 0x000000000000001n */ 1n << 0n,  // 1n
    MODERATOR:             /* 0x000000000000002n */ 1n << 1n,  // 2n
    USER:                  /* 0x000000000000004n */ 1n << 2n,  // 4n
    MUTE:                  /* 0x000000000000008n */ 1n << 3n,  // 8n
    BAN:                   /* 0x000000000000010n */ 1n << 4n,  // 16n
    POSTS_CREATE:          /* 0x000000000000020n */ 1n << 5n,  // 32n
    COMMENTS_CREATE:       /* 0x000000000000040n */ 1n << 6n,  // 64n
    ORGANIZATIONS_CREATE:  /* 0x000000000000080n */ 1n << 7n,  // 128n
    POSTS_MANAGE:          /* 0x000000000000100n */ 1n << 8n,  // 256n
    COMMENTS_MANAGE:       /* 0x000000000000200n */ 1n << 9n,  // 512n
    ORGANIZATIONS_MANAGE:  /* 0x000000000000400n */ 1n << 10n, // 1024n
    POSTS_DELETE:          /* 0x000000000000800n */ 1n << 11n, // 2048n
    COMMENTS_DELETE:       /* 0x000000000001000n */ 1n << 12n, // 4096n
    ORGANIZATIONS_DELETE:  /* 0x000000000002000n */ 1n << 13n, // 8192n
  },
  USERS: {
    READ:                  /* 0x000000000004000n */ 1n << 14n, // 16384n
    MANAGE:                /* 0x000000000008000n */ 1n << 15n, // 32768n
    MODERATE:              /* 0x000000000010000n */ 1n << 16n, // 65536n
  },
  POSTS: {
    OWNER:                 /* 0x000000000020000n */ 1n << 17n, // 131072n
    MANAGER:               /* 0x000000000040000n */ 1n << 18n, // 262144n
    VIEW:                  /* 0x000000000080000n */ 1n << 19n, // 524288n
    MANAGE:                /* 0x000000000100000n */ 1n << 20n, // 1048576n
    DELETE:                /* 0x000000000200000n */ 1n << 21n, // 2097152n
    REACT:                 /* 0x000000000400000n */ 1n << 22n, // 4194304n
    ATTACH_FILES:          /* 0x000000000800000n */ 1n << 23n, // 8388608n
    COMMENTS_READ:         /* 0x000000001000000n */ 1n << 24n, // 16777216n
    COMMENTS_CREATE:       /* 0x000000002000000n */ 1n << 25n, // 33554432n
    COMMENTS_DELETE:       /* 0x000000004000000n */ 1n << 26n, // 67108864n
    COMMENTS_MANAGE:       /* 0x000000008000000n */ 1n << 27n, // 134217728n
    COMMENTS_REACT:        /* 0x000000010000000n */ 1n << 28n, // 268435456n
    VIEWERS_MUTE:          /* 0x000000020000000n */ 1n << 29n, // 536870912n
    VIEWERS_BLOCK:         /* 0x000000040000000n */ 1n << 30n, // 1073741824n
  },
  ORGANIZATIONS: {
    OWNER:                 /* 0x000000080000000n */ 1n << 31n, // 2147483648n
    ADMINISTRATOR:         /* 0x000000100000000n */ 1n << 32n, // 4294967296n
    INVITE_CREATE:         /* 0x000000200000000n */ 1n << 33n, // 8589934592n
    RIGHTS_MANAGE:         /* 0x000000400000000n */ 1n << 34n, // 17179869184n
    READ:                  /* 0x000000800000000n */ 1n << 35n, // 34359738368n
    MANAGE:                /* 0x000001000000000n */ 1n << 36n, // 68719476736n
    DELETE:                /* 0x000002000000000n */ 1n << 37n, // 137438953472n
    POSTS_READ:            /* 0x000004000000000n */ 1n << 38n, // 274877906944n
    POSTS_CREATE:          /* 0x000008000000000n */ 1n << 39n, // 549755813888n
    POSTS_MANAGE:          /* 0x000010000000000n */ 1n << 40n, // 1099511627776n
    POSTS_DELETE:          /* 0x000020000000000n */ 1n << 41n, // 2199023255552n
    ROLES_MANAGE:          /* 0x000040000000000n */ 1n << 42n, // 4398046511104n
    MEMBERS_KICK:          /* 0x000080000000000n */ 1n << 43n, // 8796093022208n
    VIEWERS_BLOCK:         /* 0x000100000000000n */ 1n << 44n, // 17592186044416n
  }
};
```