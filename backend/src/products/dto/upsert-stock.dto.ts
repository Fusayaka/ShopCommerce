import { Color, ItemSize } from '@prisma/client';
import { IsEnum, IsInt, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';


export class UpsertStockDto {
    @IsEnum(ItemSize)
    size: ItemSize;

    @IsEnum(Color)
    color: Color;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    originalPrice?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    promotionPrice?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    stock?: number;
}
