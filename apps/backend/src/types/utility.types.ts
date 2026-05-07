type ToFunction<Type> = Type extends unknown
  ? (parameter: Type) => void
  : never;

/**
 * Преобразует объединение (A | B) в пересечение (A & B)
 */
export type UnionToIntersection<Type> =
  ToFunction<Type> extends (Parameter: infer U) => void ? U : never;
