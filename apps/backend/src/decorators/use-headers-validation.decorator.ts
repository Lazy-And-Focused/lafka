import { validateInstanceByClass } from "@/utils/validate-instance-by-class.utils";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ClassConstructor } from "class-transformer";

export const UseHeadersValidation = createParamDecorator(
  async (classConstuctor: ClassConstructor<object>, ctx: ExecutionContext) => {
    const { headers } = ctx.switchToHttp().getRequest();
    return validateInstanceByClass(headers, classConstuctor);
  },
);
