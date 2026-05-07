import { AuthGuardService } from "./auth-guard.service";
import { PrismaService } from "@/database";

export * from "./auth-guard.service";
export * from "./auth.guard";

export const AUTH_GUARD_PROVIDERS = [AuthGuardService, PrismaService] as const;
