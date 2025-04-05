import { LAFka, Rights as LAFkaRights } from "@lafka/types";
import { ArrayOrType, Bit } from "./types";

const DEFAULT_BIT = 0n;

class BitField {
  private bits: bigint;

  public constructor(bits: Bit = DEFAULT_BIT) {
    this.bits = BigInt(bits);
  }

  public static equals(first: Bit, second: Bit): boolean {
    return BigInt(first) === BigInt(second);
  }

  public static add(bit: Bit, add: ArrayOrType<Bit>): bigint {
    let output = BigInt(bit);

    Array.isArray(add)
      ? add.forEach(b => output |= BigInt(b))
      : output |= BigInt(add);

    return output;
  }
  
  public static remove(bit: Bit, remove: ArrayOrType<Bit>): bigint {
    let output = BigInt(bit);

    Array.isArray(remove)
      ? remove.forEach(b => output &= ~BigInt(b))
      : output &= ~BigInt(remove);

    return output;
  }

  public add(bits: ArrayOrType<Bit>): bigint {
    return BitField.add(this.bits, bits);
  }

  public remove(bits: ArrayOrType<Bit>): bigint {
    return BitField.remove(this.bits, bits);
  }

  /**
   * ```ts
   * import { Rights } from "@lafka/types";
   * import { BitField } from "@lafka/rights";
   * 
   * // import { LAFka } from "@lafka/types";
   * // const fockusty: LAFka.User;
   * 
   * new BitField(fockusty.rights.me).has([
   *   Rights.Lazy.RIGHTS.user.me.POSTS_CREATE,
   *   Rights.Lazy.RIGHTS.user.me.USER
   * ]); // boolean
   * ```
   * 
   * @returns {boolean}
   */
  public has(bit: ArrayOrType<Bit>): boolean {
    return BitField.equals(
      this.bits,
      Array.isArray(bit)
        ? this.summBits(bit)
        : BigInt(bit)
      );
  }

  private summBits(bits: Bit[]) {
    let summ = DEFAULT_BIT;
    bits.forEach(b => summ | BigInt(b));
    return summ;
  }
};

export { BitField };

export default BitField;
