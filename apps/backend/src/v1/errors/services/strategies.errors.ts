import { HttpStatus } from "@nestjs/common";
import { fockerorFactory } from "@/errors";

export const STRATEGIES_SERVICE_ERROS = fockerorFactory.execute(
  "STRATEGIES SERVICE EXСEPTION",
  {
    STRATEGY_NOT_FOUND: {
      message: "Strategy can not be find",
      description: "Стратегия не была найдена.",
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    },
  },
);

export default STRATEGIES_SERVICE_ERROS;
