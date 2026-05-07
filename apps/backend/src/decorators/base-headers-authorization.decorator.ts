import type { Request } from "express";
import type { ExecutionContext } from "@nestjs/common";

import { ClassConstructor } from "class-transformer";

import { createParamDecorator } from "@nestjs/common";
import { AuthorizationTypes, Headers } from "@/enums";

import { validateInstanceByClass } from "@/utils/validate-instance-by-class.utils";
import { BASE_HEADERS_AUTHORIZATION } from "@/errors";

export const BasicHeadersAuthorization = createParamDecorator(
  async (
    classConstructor: ClassConstructor<object>,
    context: ExecutionContext,
  ) => {
    const { headers } = context.switchToHttp().getRequest() as Request;
    const { [Headers.authorization]: authorization } = headers;
    if (!authorization) {
      throw BASE_HEADERS_AUTHORIZATION.AUTHORIZATION_NOT_DEFINED.execute();
    }

    const [type, ...data] = authorization.split(" ");
    if (type !== AuthorizationTypes.Basic) {
      throw BASE_HEADERS_AUTHORIZATION.BAD_TYPE.execute();
    }

    const base64 = data.join(" ");
    const json = JSON.parse(atob(base64));

    return validateInstanceByClass(json, classConstructor);
  },
);
