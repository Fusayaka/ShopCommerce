import { IsNumber, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class ValidatePromoDto {
    @IsString()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
    code: string;

    @IsNumber()
    subtotal: number;
} 