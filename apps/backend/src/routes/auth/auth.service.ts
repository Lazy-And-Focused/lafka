import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    public auth(): string {
        return "Success";
    }
};