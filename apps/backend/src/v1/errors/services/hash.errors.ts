import { HttpStatus } from "@nestjs/common";
import { fockerorFactory } from "@/errors";

export const HASH_ERRORS = fockerorFactory.execute("HASH EXСEPTION", {
  TOKEN_METHOD_NOT_ACCEPTABLE: {
    message: "Token method not acceptable.",
    description: "Метод токена не доступен к использованию.",
    status: HttpStatus.NOT_ACCEPTABLE,
  },

  AUTHORIZATION_UNDEFINED: {
    message: "authroization not defined.",
    description: "Заголовок `authorization` не был определен.",
    status: HttpStatus.UNAUTHORIZED,
  },

  INVALID_TOKEN: {
    message: "token not valided.",
    description: "Токен не прошёл проверку по некоторым свойствам.",
    status: HttpStatus.UNAUTHORIZED,
  },
});

export default HASH_ERRORS;
