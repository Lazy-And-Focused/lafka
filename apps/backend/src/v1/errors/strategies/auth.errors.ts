import { HttpStatus } from "@nestjs/common";
import { fockerorFactory } from "@/errors";

export const AUTH_STRATEGIES_ERRORS = fockerorFactory.execute(
  "AUTH STRATEGY EXСEPTION",
  {
    AUTH_NOT_FOUND: {
      message: "Authorization not found. (where:{key} with {value})",
      description:
        "Авторизация пользователя (с ключом {key} и значением {value}) не была найдена в БД.",
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    },

    PASSWORD_ERROR: {
      message: "Password not equals.",
      description: "Пароль не совпадает с паролем из БД.",
      status: HttpStatus.FORBIDDEN,
    },

    USER_NOT_FOUND: {
      message: "User not found. (where:{key} with {value})",
      description:
        "Пользователь (с ключом {key} и значением {value}) не был найден в БД.",
    },
  },
);

export default AUTH_STRATEGIES_ERRORS;
