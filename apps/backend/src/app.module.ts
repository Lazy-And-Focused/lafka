import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { LoggerMiddleware } from "./middleware/logger.middleware";
import { modules } from "./routes/";
import { RouterModule } from "@nestjs/core";

@Module({
	imports: [
		...modules,
		...modules.map((module) => RouterModule.register([{ path: "api", module }]))
	]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes("/");
	}
}
