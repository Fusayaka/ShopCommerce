import { Controller, Get, Post, Body, Param, Patch, Delete, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUsersDto } from './dto/create-users.dto.js';
import { UpdateUsersDto } from './dto/update-users.dto.js';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll(){
        const users = this.usersService.findAll();
        if (!users) throw new NotFoundException("No users found");
        return users;
    }

    @Get(":id")
    findOne(@Param("id") id: number){
        const user = this.usersService.findOne(+id);
        if(!user) throw new NotFoundException("User not found");
        return user;
    }

    @Post()
    create(@Body() createUsersDto: CreateUsersDto){
        return this.usersService.create(createUsersDto);
    }

    @Patch(":id")
    update(
        @Param("id") id: number, 
        @Body() updateUSersDto: UpdateUsersDto
    ){
        return this.usersService.update(+id, updateUSersDto);
    }

    @Delete(":id")
    delete(@Param("id") id: number){
        return this.usersService.delete(+id);
    }
}
