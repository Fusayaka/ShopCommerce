import { IsInt, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateCommentDto {
    @IsNumber()
    @IsNotEmpty()
    productId: number;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;
}
