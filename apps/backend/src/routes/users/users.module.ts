import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { Service } from "./users.service";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [CacheModule.register()],
  controllers: [UsersController],
  providers: [Service]
})
export default class UsersModule {}
