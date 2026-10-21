import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, Max, ValidateNested, IsInt } from 'class-validator';
import { UpsertStockDto } from './upsert-stock.dto.js';

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
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => UpsertStockDto)
    stocks?: UpsertStockDto[];

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @IsOptional()
    @IsInt()
    numReviews: number;
}
