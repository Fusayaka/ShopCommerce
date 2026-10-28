import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUsersDto } from './dto/create-users.dto.js';
import { UpdateUsersDto } from './dto/update-users.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CloudinaryService, UploadableFile } from '../cloudinary/cloudinary.service.js';

const HIDDEN_USER_FIELDS = { password: true } as const;
const MAX_AVATAR_BYTES = 1 * 1024 * 1024;

interface UploadedImage extends UploadableFile {
    mimetype: string;
    size: number;
}

function extractPublicIdFromUrl(url: string): string | null {
    try {
        const regex = /\/upload\/(?:v\d+\/)?([^\.]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    } catch {
        return null;
    }
}

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cloudinary: CloudinaryService
    ){}

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

    async update(id: number, dto: UpdateUsersDto, file?: UploadedImage){
        const existing = await this.prisma.user.findUnique({ where: {id} });
        if (!existing) throw new NotFoundException("Can not update: User not found");

        const { currentPassword, newPassword, ...data } = dto;

        if (currentPassword && newPassword){
            const passwordMatches = await bcrypt.compare(currentPassword, existing.password);
            if (!passwordMatches) throw new UnauthorizedException("Current password is incorrect");
            if ( currentPassword === newPassword) throw new BadRequestException("New password must be different from current password");
            data.password = await bcrypt.hash(newPassword, 10);
        }

        if (file) {
            if (!file.mimetype?.startsWith('image/')) throw new BadRequestException('Only image files are allowed');
            if (file.size > MAX_AVATAR_BYTES) throw new BadRequestException('Image must be 1MB or smaller');

            const newAvatarUrl = await this.cloudinary.uploadImage(file);
            data.avatar = newAvatarUrl;

            if (existing.avatar && existing.avatar.includes('cloudinary.com')) {
                const oldPublicId = extractPublicIdFromUrl(existing.avatar);
                if (oldPublicId) {
                    await this.cloudinary.deleteImage(oldPublicId);
                }
            }
        }

        return this.prisma.user.update({
            where: {id},
            data,       
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
