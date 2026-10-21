import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUrl, MinLength, MaxLength, Matches } from "class-validator";

export class CreateUsersDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(6, { message: "Password must be at least 6 characters long" })
    @MaxLength(36, { message: "Password must be at most 36 characters long" })
    @Matches(/^(?=.*[a-z])(?=.*\d)/, { message: "Password should contain at least 1 lowercase character and 1 number" })
    password: string;

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
