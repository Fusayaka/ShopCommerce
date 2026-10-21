import { PartialType } from "@nestjs/mapped-types";
import { IsNotEmpty, IsOptional, IsString, MinLength, MaxLength, Matches } from "class-validator";
import { CreateUsersDto } from "./create-users.dto.js";

export class UpdateUsersDto extends PartialType(CreateUsersDto) {
    @IsString()
    @IsOptional()
    @IsNotEmpty({ message: "Current password is required to change password" })
    currentPassword?: string;

    @IsString()
    @IsOptional()
    @MinLength(6, { message: "Password must be at least 6 characters long" })
    @MaxLength(36, { message: "Password must be at most 36 characters long" })
    @Matches(/^(?=.*[a-z])(?=.*\d)/, { message: "Password should contain at least 1 lowercase character and 1 number" })
    newPassword?: string;
}