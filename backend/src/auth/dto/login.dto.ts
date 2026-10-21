import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto{
    @IsString()
    @IsNotEmpty({message: "Please enter username or email"})
    email: string;

    @IsString()
    @IsNotEmpty({message: "Please enter password"})
    password: string;
}