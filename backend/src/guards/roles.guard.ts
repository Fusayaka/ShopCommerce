import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLE_KEYS } from "../common/decorators/roles.decorator.js";
import { UserRole } from "@prisma/client";

interface UserPayload {
    id: number,
    email: string,
    role: UserRole,
    name: string,
    avatar: string,
}

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            ROLE_KEYS, [
                context.getHandler(),
                context.getClass(),
            ],
        );
        if (!requiredRoles) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user as UserPayload;

        if (!user || !user.role) throw new ForbiddenException("Role not found!");
        
        return requiredRoles.includes(user.role);
    }
}