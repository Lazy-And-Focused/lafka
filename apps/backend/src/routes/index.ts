import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";

export const modules = [AuthModule, UsersModule] as const;
