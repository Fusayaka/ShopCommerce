import { IsEmail, IsString, MaxLength, MinLength, IsNotEmpty, Matches } from "class-validator";

export class RegisterDto{
    @IsString()
    @IsNotEmpty({message: "Name should not be empty"})
    name: string;

    @IsEmail({}, {message: "Invalid email address"})
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(6, {message: "Password must be at least 6 characters long"})
    @MaxLength(36, { message: "Password must be at most 36 characters long" })
    @Matches(/^(?=.*[a-z])(?=.*\d)/, {message: "Password should contain at least 1 lowercase character"})
    password: string;
}