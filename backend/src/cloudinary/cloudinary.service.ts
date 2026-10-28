import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export interface UploadableFile {
    buffer: Buffer;
    mimetype: string;
}

@Injectable()
export class CloudinaryService {
    constructor(private readonly configService: ConfigService) {
        cloudinary.config({
            cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get<string>('CLOUDINARY_SECRET_KEY'),
        });
    }

    async uploadImage(file: UploadableFile, folder = 'avatars'): Promise<string> {
        const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        try {
            const result = await cloudinary.uploader.upload(dataUri, {
                folder,
                resource_type: 'image',
            });
            return result.secure_url;
        } 
        catch {
            throw new InternalServerErrorException('Failed to upload image');
        }
    }

    async deleteImage(publicId: string): Promise<void> {
        try {
            await cloudinary.uploader.destroy(publicId);
        }
        catch (error) {
            throw new InternalServerErrorException('Failed to delete old image from cloud storage.');
        }
    }
}
