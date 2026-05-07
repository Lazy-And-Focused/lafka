import { PipeTransform } from "@nestjs/common";
import { USERNAME_ERRORS } from "../errors/pipes/username.errors";

import { env } from "@/services";

export class UsernamePipe implements PipeTransform {
  public static validate(value: string) {
    const username = value.trim().toLowerCase();
    const usernameValided = Array.from(username).every((char) =>
      env.AVAILABLE_USERNAME_SYMBOLS.includes(char),
    );
    if (!usernameValided) {
      throw USERNAME_ERRORS.INVALID_USERNAME.execute();
    }

    return username;
  }

  public transform(value: unknown) {
    if (typeof value !== "string") {
      throw USERNAME_ERRORS.USERNAME_NOT_STRING.execute();
    }

    return UsernamePipe.validate(value);
  }
}
