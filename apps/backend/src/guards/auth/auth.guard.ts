import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

import Service from './auth-guard.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {
    }
    
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        if (this.reflector.get<boolean>('isPublic', context.getHandler()))
            return true;

        const request = context.switchToHttp().getRequest<Request>();

        return new Service().validateRequest(request);
    }
}