import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "@/database/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { env, PROGRAM_MODE } from "@/services";

const ADAPTER =
  PROGRAM_MODE === "development"
    ? new PrismaPg({ connectionString: env.DATABASE_URL })
    : undefined;

const ACCELERATE_URL =
  PROGRAM_MODE === "development" ? undefined : env.DATABASE_URL;

const OPTIONS = {
  adapter: ADAPTER,
  accelerateUrl: ACCELERATE_URL,
} as ConstructorParameters<typeof PrismaClient>[0];

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  public constructor() {
    super(OPTIONS);
  }

  public async onModuleInit() {
    await this.$connect();
  }

  public async onModuleDestroy() {
    await this.$disconnect();
  }
}

export default PrismaService;
