import { HttpStatus } from "@nestjs/common";
import { fockerorFactory } from "@/errors";

import { env } from "@/services";

export const USERNAME_ERRORS = fockerorFactory.execute("USERNAME EXСEPTION", {
  USERNAME_NOT_STRING: {
    message: "username must be string",
    description: "Имя пользователя не является строкой",
    status: HttpStatus.BAD_REQUEST,
  },

  INVALID_USERNAME: {
    message: `username not valided and must includes only \`${env.AVAILABLE_USERNAME_SYMBOLS}\``,
    description: `Имя пользователя должно содержать только определенный набор символов: \`${env.AVAILABLE_USERNAME_SYMBOLS}\``,
    status: HttpStatus.BAD_REQUEST,
  },
});

export default USERNAME_ERRORS;
