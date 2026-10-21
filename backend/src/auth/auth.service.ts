import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config';
import * as bcrpyt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import type { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service.js';
import { User } from '@prisma/client';



@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService, 
        private configService: ConfigService, 
        private readonly prisma: PrismaService
    ){}

    async register(dto: RegisterDto){
        const existingUser = await this.prisma.user.findUnique({where: {email: dto.email}});
        if (existingUser) throw new ConflictException("An account with this email already exists");

        const passwordHash = await bcrpyt.hash(dto.password, 10);

        const newUser = await this.prisma.user.create({
            data: {
                name: dto.name,
                email: dto.email,
                password: passwordHash,
            }
        });

        return {
            message: "Registration successfully",
        }
    }

    async login(dto: LoginDto, response: Response){
        const user =  await this.prisma.user.findUnique({where: {email: dto.email}});
        if (!user) throw new UnauthorizedException("Invalid email or password");

        const isValidPassword = await bcrpyt.compare(dto.password, user.password);
        if (!isValidPassword) throw new UnauthorizedException("Invalid email or password");

        const {accessToken, refreshToken} = await this.generateToken(user);

        await this.saveRefreshToken(user.id, refreshToken);
        await this.setRefreshTokenCookie(response, refreshToken)

        return {
            message: "Login successfully",
            accessToken,
        }
    }

    async refreshTokens(rawRefreshToken: string, response: Response){
        if (!rawRefreshToken) throw new UnauthorizedException("Refresh token not found!");

        const tokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

        const storedToken = await this.prisma.refreshToken.findUnique({
            where: { tokenHash },
            include: {user: true},
        }); 

        if (!storedToken || storedToken.expiresAt < new Date()){
            throw new UnauthorizedException("Invalid or expired Refresh Token")
        }

        const {accessToken, refreshToken: newRefreshToken} = await this.generateToken(storedToken.user);

        const newTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await this.prisma.$transaction([
            this.prisma.refreshToken.delete({
                where: {tokenHash},
            }),
            this.prisma.refreshToken.create({
                data: {
                    tokenHash: newTokenHash,
                    expiresAt,
                    userId: storedToken.userId,
                }
            })
        ])

        await this.setRefreshTokenCookie(response, newRefreshToken);

        return {
            accessToken,
        };
    }

    async logoutAll(userId: number, response: Response){
        await this.prisma.refreshToken.deleteMany({
            where: {userId}
        });

        response.clearCookie('refresh_token', {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
        })
        
        return {
            message: "Logged out from all devices successfully",
        }
    }

    async logoutDevice(refreshToken: string, response: Response){
        if (!refreshToken) throw new UnauthorizedException("Refresh token is required!");

        const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        await this.prisma.refreshToken.delete({
            where: {tokenHash}
        }).catch(() => {});

        response.clearCookie('refresh_token', {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        });

        return {
            message: "Logged out from device successfully",
        }
    }

    private async generateToken(user: User){
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        }

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.get('JWT_ACCESS_SECRET'),
                expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
            }),
            this.jwtService.signAsync({...payload, jti: crypto.randomUUID()}, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
            })
        ]);

        return {accessToken, refreshToken};
    }

    private async saveRefreshToken(userId: number, refreshToken: string){
        const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await this.prisma.refreshToken.create({
            data: {
                tokenHash,
                userId,
                expiresAt,
            }
        });
    }

    private async setRefreshTokenCookie(res: Response, refreshToken: string){
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
    }
}