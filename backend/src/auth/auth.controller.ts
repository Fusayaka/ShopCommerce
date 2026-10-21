import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import type { Response, Request } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { JwtPayload } from '../common/decorators/current-user.decorator.js';
import { Public } from '../common/decorators/public.decorator.js';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ){}

    @Public()
    @Post('register')
    async register(@Body() dto: RegisterDto){
        return this.authService.register(dto);
    }

    @Public()
    @Post('login')
    async login(
        @Body() dto: LoginDto,
        @Res({passthrough: true}) response: Response
    ){
        return this.authService.login(dto, response);
    }

    @Public()
    @Post('refresh')
    async refresh(
        @Req() request: Request,
        @Res({passthrough: true}) response: Response
    ){
        const refreshToken = request.cookies['refresh_token'];
        return this.authService.refreshTokens(refreshToken, response);
    }

    @Public()
    @Post('logout')
    async logout(
        @Req() request: Request,
        @Res({passthrough: true}) response: Response
    ){
        const refreshToken = request.cookies['refresh_token'];
        return this.authService.logoutDevice(refreshToken, response);
    }


    @Post('logout-all')
    async logoutAll(
        @CurrentUser('id') userId: number,
        @Res({passthrough: true}) response: Response
    ){
        return this.authService.logoutAll(userId, response);
    }

    @Get('me')
    me(@CurrentUser() user: JwtPayload){
        return user;
    }
}
