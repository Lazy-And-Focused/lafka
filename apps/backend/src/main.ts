import "database/database/index.database";

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import Passport from "./strategies/google-auth.strategy";

import Session from './app/session.app';
import Api from 'api/index.api';

const passport = new Passport();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    
    app.use(require("cors")({ origin: [new Api().env.CLIENT_URL], credentials: true }));

    new Session("AVlzkjbsazvhxczvoiz", app).create();

    app.use(passport.session());
    app.use(passport.initialize());

    await app.listen(3001);
};

bootstrap();