import connect from "database/database/index.database";

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

import Passport from "./strategies/google-auth.strategy";

import Session from "./app/session.app";
import Api from "api/index.api";

const passport = new Passport();
const api = new Api();

async function bootstrap() {
	await connect(api.env.MONGO_URL);

	const app = await NestFactory.create(AppModule);

	app.use(require("cors")({ origin: [api.env.CLIENT_URL], credentials: true }));

	new Session("AVlzkjbsazvhxczvoiz", app).create();

	app.use(passport.session());
	app.use(passport.initialize());

	await app.listen(3001);
}

bootstrap();
