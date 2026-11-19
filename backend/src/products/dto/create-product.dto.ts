import { IsNotEmpty, IsNumber, IsOptional, IsString, Min, Max, IsInt } from 'class-validator';
export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @IsOptional()
    @IsInt()
    numReviews: number;
}
