import { Module } from "@nestjs/common";
import { PostsContoller } from "./posts.controller";
import { PostsService } from "./posts.service";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [CacheModule.register()],
  controllers: [PostsContoller],
  providers: [PostsService]
})
export default class PostsModule {}
