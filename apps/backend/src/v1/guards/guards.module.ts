import { Module } from "@nestjs/common";

import { PrismaService } from "@/database";
import { AuthGuardService } from "./auth";
import { HashService } from "../services";

@Module({
  providers: [AuthGuardService, PrismaService, HashService],
})
export class GuardsModule {}

export default GuardsModule;
