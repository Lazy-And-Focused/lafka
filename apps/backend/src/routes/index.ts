import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { PostsModule } from "./posts/posts.module";

export const modules = [
  AuthModule,
  UsersModule,
  PostsModule
] as const;
