import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateUsersDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsOptional()
    @IsUrl()
    avatar?: string;

    @IsOptional()
    @IsString()
    description?: string;
}
