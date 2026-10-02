import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    originalPrice: number

    @IsOptional()
    @IsNumber()
    promotionPrice?: number

    @IsNumber()
    rating: number;

    @IsInt()
    numReviews: number

    @IsUrl()
    image: string;
}
