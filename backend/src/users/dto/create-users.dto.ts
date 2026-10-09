import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUrl } from "class-validator";

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

    @IsOptional()
    @IsPhoneNumber()
    @IsString()
    contact?: string;

    @IsOptional()
    @IsString()
    address?: string;
}
