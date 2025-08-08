import { Module } from "@nestjs/common";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [CacheModule.register()],
  controllers: [PostsController],
  providers: [PostsService]
})
export default class PostsModule {}
