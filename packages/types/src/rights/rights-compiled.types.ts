/**
 * - this file was auto genereted by rights.types
 * - if you see inconsistencies: https://github.com/Lazy-And-Focused/lafka/issues
 */
export const rights = {
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
    organizationsCreate: 1n << 13n,
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
    commentsReact: 1n << 27n,
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
    postsRead: 1n << 41n,
  } as const,
} as const;

export type Keys = keyof typeof rights;
export type Rights<T extends Keys> = (typeof rights)[T];
export type RightsKeys<T extends Keys> = keyof Rights<T>;

export default rights;
