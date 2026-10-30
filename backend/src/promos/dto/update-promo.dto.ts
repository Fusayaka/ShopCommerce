import { IsDateString, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { Transform } from "class-transformer";

export class UpdatePromoDto {
    @IsString()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
    code: string;
    
    @ValidateIf((o) => !o.discountPer)
    discountNum: number;

    @ValidateIf((o) => !o.discountNum)
    discountPer: number;

    @IsOptional()
    @IsNumber()
    maxDiscountNum?: number;

    @IsDateString()
    @IsOptional()
    expiredAt?: string;

    @IsOptional()
    @IsNumber()
    minToApply?: number
}
