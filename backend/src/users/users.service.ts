import { Injectable } from '@nestjs/common';
import { CreateUsersDto } from './dto/create-users.dto.js';
import { UpdateUsersDto } from './dto/update-users.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService){}

    findAll(){
        return this.prisma.user.findMany();
    }

    findOne(id: number){
        return this.prisma.user.findUnique({
            where: {id}
        });
    }

    create(createUserDto: CreateUsersDto){
        return this.prisma.user.create({
            data: createUserDto
        });
    }

    update(id: number, updateUsersDto: UpdateUsersDto){
        return this.prisma.user.update({
            where: {id},
            data: updateUsersDto,
        });
    }

    delete(id: number){
        return this.prisma.user.delete({
            where: {id}
        })
    }
}
