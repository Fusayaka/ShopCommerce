import { IsDateString, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";


export class UpdatePromoDto {
    @IsString()
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
