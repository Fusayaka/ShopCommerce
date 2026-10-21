import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { IS_PUBLIC_KEY } from "../common/decorators/public.decorator.js";
import { UsersService } from "../users/users.service.js";

@Injectable()
export class JwtAuthGuard implements CanActivate{
    constructor(
        private userService: UsersService,
        private reflector: Reflector,
        private jwtService: JwtService,
        private configService: ConfigService,
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ])

        if (isPublic) return true;

        const req = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(req);

        if (!token) throw new UnauthorizedException("No access token provided");

        let payload: {
            id: number;
            email: string;
            role: string;
        }
        try {
            payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get("JWT_ACCESS_SECRET")
            });
        }
        catch {
            throw new UnauthorizedException("Invalid or expired access token");
        }

        const user = await this.userService.findOne(payload.id).catch(() => null);
        if (!user) throw new UnauthorizedException("User no longer exist");
        req.user = user;

        return true;
    }


    private extractTokenFromHeader(req: Request): string | undefined {
        const [type, token] = ((req.headers as unknown) as Record<string, string>).authorization?.split(" ") ?? [];
        return (type === "Bearer")? token : undefined;
    }
}