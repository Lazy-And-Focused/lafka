import { Module } from "@nestjs/common";

import { TestController } from "./test.controller";
import { AUTH_GUARD_PROVIDERS } from "@/v1/guards";

@Module({
  imports: [],
  controllers: [TestController],
  providers: [...AUTH_GUARD_PROVIDERS],
})
export class TestModule {}

export default TestModule;
