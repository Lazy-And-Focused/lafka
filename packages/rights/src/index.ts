import { LAFka, Rights as LAFkaTypes } from "@lafka/types";

export { Types } from "./types";

type ToArray<T, K = T> = [K, ...T[]];
type ToDeleteType<T extends LAFkaTypes.LazyRightsKeys|false = false> = T extends LAFkaTypes.LazyRightsKeys
  ? [T, LAFkaTypes.GetKeys<T>, ...LAFkaTypes.GetKeys<T>[]]
  : bigint;

type ToDeleteFunc = (existed: bigint, toDelete: bigint[]) => bigint;
type ToGrateFunc = (existed: bigint, toGrate: bigint[]) => bigint;

export namespace Rights {
  function GratingLogic(func: "increase"|"decrease"): ToDeleteFunc|ToGrateFunc {
    return (exist, to) => {
      let right = exist;
      
      if (func === "decrease")
        to.forEach(v => (right & v) === v
          ? right ^ v
          : false);
      else
        to.forEach(v => (right & v) === 0n
          ? right | v
          : false);

      return right;
    }
  }

  function ServiceLogicGrate<T extends LAFkaTypes.LazyRightsKeys|false = false>({
    existed, to, func
  }: {
    existed: bigint,
    to: T extends false
      ? ToArray<bigint>
      : ToDeleteType<T> | ToArray<bigint>,
    func: ToDeleteFunc | ToGrateFunc
  }) {
    if (typeof to[0] === "bigint") {
      const data = to.map(v => {if (LAFkaTypes.Parser.exist(v)) return v}).filter(v => v !== undefined);
      
      if (data.length > 0) return func(existed, data);
      else return false;
    } else {
      const data = to.splice(1).map(v => {
        return LAFkaTypes.Parser.toBigInt<any>(to[0], v);
      });

      return func(existed, data);
    }
  };

  export class Service<T extends LAFkaTypes.LazyRightsKeys|false = false> {
    public constructor(public readonly rights: bigint) {};

    public increase(toDelete: T extends false
      ? ToArray<bigint>
      : ToDeleteType<T> | ToArray<bigint>
    ) {
      Service.decrease({existed: this.rights, toDelete});
    }
    
    public decrease(toGrate: T extends false
      ? ToArray<bigint>
      : ToDeleteType<T> | ToArray<bigint>
    ) {
      Service.increase({existed: this.rights, toGrate});
    }

    public static increase<T extends LAFkaTypes.LazyRightsKeys|false = false>({
      existed, toGrate
    }: {
      existed: bigint,
      toGrate: T extends false
        ? ToArray<bigint>
        : ToDeleteType<T> | ToArray<bigint>
    }) {
      ServiceLogicGrate({
        existed, to: toGrate,
        func: GratingLogic("increase")
      })
    }

    public static decrease<T extends LAFkaTypes.LazyRightsKeys|false = false>({
      existed, toDelete
    }: {
      existed: bigint,
      toDelete: T extends false
        ? ToArray<bigint>
        : ToDeleteType<T> | ToArray<bigint>
    }) {
      ServiceLogicGrate({
        existed, to: toDelete,
        func: GratingLogic("decrease")
      })
    }
  }

  export class User {
    public constructor(public readonly user: LAFka.User) {};

    /**
     * keys that can be returned:
     * @MeRightsKeys LAFka.MeRightsKeys (ME: MeRightsKeys[])
     * @UsersRightsKeys LAFka.UsersRightsKeys (USERS: UsersRightsKeys[])
     * @PostsRightsKeys LAFka.PostsRightsKeys (POSTS: PostsRightsKeys[])
     * @OrganizationsRightsKeys LAFka.OrganizationsRightsKeys (ORGANIZATIONS: OrganizationsRightsKeys[])
     */
    public getDefaultRights(): Record<LAFkaTypes.LazyRightsKeys, string[]> {
      const data: Record<LAFkaTypes.LazyRightsKeys, string[]> = {
        "ME": [],
        "USERS": [],
        "POSTS": [],
        "ORGANIZATIONS": []
      };

      for (const key of LAFkaTypes.LAZY_KEYS) {
        for (const right of Object.keys(LAFkaTypes.Default.USER_RIGHTS[key])) {
          if (this.defaultHas((LAFkaTypes.Default.USER_RIGHTS[key] as any)[right])) {
            data[key].push(right);
          }
        };
      };

      return data;
    }

    public getRights<T extends Exclude<LAFkaTypes.RightsKeys, "default">>(type: T, id: string): LAFkaTypes.GetTypes<T>[] {
      const def = LAFkaTypes.Default[`${type.toUpperCase()}_RIGHTS` as `${Uppercase<T>}_RIGHTS`];
      return Object.keys(def).filter(k =>
        (BigInt(Object.fromEntries(this.user.rights[type])[id]) & (def as any)[k]) === (def as any)[k]) as any[];
    }

    public userHas(right: bigint, id: string): boolean {
      return (BigInt(Object.fromEntries(this.user.rights.users)[id]) & right) === right;
    }

    public postsHas(right: bigint, id: string): boolean {
      return (BigInt(Object.fromEntries(this.user.rights.posts)[id]) & right) === right;
    }

    public organizationsHas(right: bigint, id: string): boolean {
      return (BigInt(Object.fromEntries(this.user.rights.organizations)[id]) & right) === right;
    }

    public defaultHas(right: bigint): boolean {
      return (BigInt(this.user.rights.default) & right) === right;
    }
  }
}