import { Rights as LAFkaTypes } from "@lafka/types";

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
      
      if (func === "decrease") to.forEach(v => right ^ v);
      else to.forEach(v => right | v);

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
}

Rights.Service.decrease({
  existed: 1n,
  toDelete: [1n, 2n]
})