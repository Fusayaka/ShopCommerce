import {
    Controller, Get, Post, Body, Param, Patch, Delete,
    UploadedFile,
    UseInterceptors,
    UseGuards,
    ForbiddenException
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUsersDto } from './dto/create-users.dto.js';
import { UpdateUsersDto } from './dto/update-users.dto.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { UploadableFile } from '../cloudinary/cloudinary.service.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { type User, UserRole } from '@prisma/client';
import { UpdateUserRoleDto } from './dto/update-user-role.dto.js';

interface UploadedImage extends UploadableFile {
    mimetype: string;
    size: number;
}

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Get("me")
    findMe(@CurrentUser('id') userId: number){
        return this.usersService.findOne(userId);
    }

    @Patch("me")
    @UseInterceptors(FileInterceptor('file'))
    updateMe(
        @CurrentUser('id') userId: number,
        @Body() updateUsersDto: UpdateUsersDto,
        @UploadedFile() file?: UploadedImage
    ){
        return this.usersService.update(userId, updateUsersDto, file);
    }

    @Get()
    @UseGuards(RolesGuard)
    @Roles(UserRole.admin)
    findAll(){
        return this.usersService.findAll();
    }

    @Get(":id")
    findOne(
        @Param("id") id: number,
        @CurrentUser() user: User,
    ){
        if (!(user.role == UserRole.admin || user.role == UserRole.manager) && user.id !== id){
            throw new ForbiddenException("This profile can not be accessed!")
        }
        return this.usersService.findOne(+id);
    }

    @Post()
    create(@Body() createUsersDto: CreateUsersDto){
        return this.usersService.create(createUsersDto);
    }

    @Patch(":id")
    @UseInterceptors(FileInterceptor('file'))
    update(
        @Param("id") id: number, 
        @Body() updateUSersDto: UpdateUsersDto,
        @CurrentUser() user: User,
        @UploadedFile() file?: UploadedImage,
    ){
        if (user.id !== id || user.role !== UserRole.admin) throw new ForbiddenException("You are not allowed to update another user's data");
        return this.usersService.update(+id, updateUSersDto, file);
    }

    @UseGuards(RolesGuard)
    @Roles(UserRole.admin)
    @Patch(":id/role")
    updateRole(
        @Param("id") id: number,
        @Body() dto: UpdateUserRoleDto,
        @CurrentUser() currentUser: User
    ){
        return this.usersService.updateRole(id, dto.role, currentUser);
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard)
    delete(
        @Param("id") id: number,
        @CurrentUser() user: User,
    ){
        const isAdmin = user.role == UserRole.admin;
        const isSelf = user.id === id;
        if (!isSelf && !isAdmin) throw new ForbiddenException("You are not allowed to delete this user!");

        return this.usersService.delete(+id, user.role);
    }
}
