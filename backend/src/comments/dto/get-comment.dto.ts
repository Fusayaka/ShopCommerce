import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class GetCommentQueryDto{
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    productId?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    userId?: number;
}