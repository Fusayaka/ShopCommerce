import {
    Controller, Get, Post, Body, Param, Patch, Delete,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUsersDto } from './dto/create-users.dto.js';
import { UpdateUsersDto } from './dto/update-users.dto.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { UploadableFile } from '../cloudinary/cloudinary.service.js';
import { FileInterceptor } from '@nestjs/platform-express';

interface UploadedImage extends UploadableFile {
    mimetype: string;
    size: number;
}

@Controller('users')
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
    findAll(){
        return this.usersService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: number){
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
        @UploadedFile() file?: UploadedImage
    ){
        return this.usersService.update(+id, updateUSersDto, file);
    }

    @Delete(":id")
    delete(@Param("id") id: number){
        return this.usersService.delete(+id);
    }
}
