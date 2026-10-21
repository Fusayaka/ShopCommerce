import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUsersDto } from './dto/create-users.dto.js';
import { UpdateUsersDto } from './dto/update-users.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

const HIDDEN_USER_FIELDS = { password: true } as const;

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService){}

    async findAll(){
        const users = await this.prisma.user.findMany({ omit: HIDDEN_USER_FIELDS });
        if (!users) throw new NotFoundException("No users found");
        return users;
    }

    async findOne(id: number){
        const user = await this.prisma.user.findUnique({
            where: {id},
            omit: HIDDEN_USER_FIELDS,
        });
        if(!user) throw new NotFoundException("User not found");
        return user;
    }

    findbyEmail(email: string){
        return this.prisma.user.findUnique({
            where: {email},
        })
    }

    async create(dto: CreateUsersDto){
        const password = await bcrypt.hash(dto.password, 10);
        return this.prisma.user.create({
            data: { ...dto, password },
            omit: HIDDEN_USER_FIELDS,
        });
    }

    async update(id: number, dto: UpdateUsersDto){
        const existing = await this.prisma.user.findUnique({ where: {id} });
        if (!existing) throw new NotFoundException("Can not update: User not found");

        if (dto.currentPassword && dto.newPassword){
            const passwordMatches = await bcrypt.compare(dto.currentPassword, existing.password);
            if (!passwordMatches) throw new UnauthorizedException("Current password is incorrect");
            dto.password = await bcrypt.hash(dto.newPassword, 10);
        }

        return this.prisma.user.update({
            where: {id},
            data: {...dto},
            omit: HIDDEN_USER_FIELDS,
        });
    }

    async delete(id: number){
        const user = await this.prisma.user.delete({
            where: {id},
            omit: HIDDEN_USER_FIELDS,
        });
        if(!user) throw new NotFoundException("Can not delete: User not found");
        return user;
    }
}
