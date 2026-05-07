import { Module } from "@nestjs/common";
import { SentryController } from "./sentry.controller";
import { AUTH_GUARD_PROVIDERS } from "@1/guards";

@Module({
  controllers: [SentryController],
  providers: [...AUTH_GUARD_PROVIDERS],
})
export class SentryModule {}

export default SentryModule;
