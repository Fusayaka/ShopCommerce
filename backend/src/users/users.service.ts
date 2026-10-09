import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsersDto } from './dto/create-users.dto.js';
import { UpdateUsersDto } from './dto/update-users.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService){}
    
    async findAll(){
        const users = await this.prisma.user.findMany();
        if (!users) throw new NotFoundException("No users found");
        return users;
    }

    async findOne(id: number){
        const user = await this.prisma.user.findUnique({
            where: {id}
        });
        if(!user) throw new NotFoundException("User not found");
        return user;
    }

    create(createUserDto: CreateUsersDto){
        return this.prisma.user.create({
            data: createUserDto
        });
    }

    async update(id: number, updateUsersDto: UpdateUsersDto){
        const user = await this.prisma.user.update({
            where: {id},
            data: updateUsersDto,
        });
        if(!user) throw new NotFoundException("Can not update: User not found");
        return user;
    }

    async delete(id: number){
        const user = await this.prisma.user.delete({
            where: {id}
        });
        if(!user) throw new NotFoundException("Can not delete: User not found");
        return user;
        
    }
}
