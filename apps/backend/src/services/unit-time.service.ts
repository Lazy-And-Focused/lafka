const UNIT = [
  "years",
  "year",
  "yrs",
  "yr",
  "y",
  "weeks",
  "week",
  "w",
  "days",
  "day",
  "d",
  "hours",
  "hour",
  "hrs",
  "hr",
  "h",
  "minutes",
  "minute",
  "mins",
  "min",
  "m",
  "seconds",
  "second",
  "secs",
  "sec",
  "s",
  "milliseconds",
  "millisecond",
  "msecs",
  "msec",
  "ms",
] as const;

export type Unit = (typeof UNIT)[number];
export type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>;
export type StringValue =
  | `${number}`
  | `${number}${UnitAnyCase}`
  | `${number} ${UnitAnyCase}`;

const UNIT_REGEX = /^(\d+)\s*([a-zA-Z]+)$/;

export const validateString = (value?: string): StringValue => {
  if (!value) {
    throw new Error("Value is not defined");
  }

  if (/^\d+$/.test(value)) {
    return value as StringValue;
  }

  const match = value.match(UNIT_REGEX);
  if (!match) {
    throw new Error(
      `Invalid format: "${value}". Expected "{number}{unit}" or "{number} {unit}"`,
    );
  }

  const [, , unitMatch] = match;
  const unit = unitMatch.toLowerCase() as Unit;

  if (!UNIT.includes(unit)) {
    throw new Error(
      `Unknown unit: "${unitMatch}". Valid units are: ${UNIT.join(", ")}`,
    );
  }

  return value as StringValue;
};
