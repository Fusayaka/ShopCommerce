import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export interface JwtPayload {
    id: number;
    email: string;
    role: string;
}

type RequestWithUser = Request & {user: JwtPayload};

export const CurrentUser = createParamDecorator(
    (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest<RequestWithUser>();
        return data ? req.user?.[data] : req.user;
    }
)