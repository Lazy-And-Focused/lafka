import { FockerorFactory } from "fockeror";
import { HttpException } from "@nestjs/common";
import { logger } from "@/services";

export const fockerorFactory = new FockerorFactory(HttpException, logger);
