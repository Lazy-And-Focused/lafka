import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";

@Module({
  controllers: [AuthController]
})
export default class AuthModule {}
