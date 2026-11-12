import { IsInt, IsNumber, IsOptional, IsPositive, Min, ValidateIf } from 'class-validator';

export class UpdateStockDto {
    @IsOptional()
    @IsInt()
    @Min(0)
    stock?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    originalPrice?: number;

    @IsOptional()
    @ValidateIf((_, value) => value !== null)
    @IsNumber()
    @IsPositive()
    promotionPrice?: number | null;
}
