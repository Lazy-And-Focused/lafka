import { HttpStatus } from "@nestjs/common";
import { fockerorFactory } from "../error.factory";

export const BASE_HEADERS_AUTHORIZATION = fockerorFactory.execute(
  "BASE HEADERS AUTHORIZATION EXСEPTIONS",
  {
    AUTHORIZATION_NOT_DEFINED: {
      message: "Authorization is required",
      description: "Значение Authorization не было объявлено",
      status: HttpStatus.BAD_REQUEST,
    },

    BAD_TYPE: {
      message: "Authorization must be Basic type",
      description: "Тип авторизации должен быть Basic",
      status: HttpStatus.BAD_REQUEST,
    },
  },
);
