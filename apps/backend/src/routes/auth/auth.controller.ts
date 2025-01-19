import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
    @Get("google")
    public auth(): string {
        return "You authenficated as cat";
    }
}