import { Optional } from "@nestjs/common";
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min, Max } from "class-validator";
import { Transform, Type } from "class-transformer";

export class GetProductsQueryDto{
    @Optional()
    @IsString()
    search?: string;
    
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    minPrice?: number;
    
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    maxPrice?: number;
    
    @IsOptional()
    @Transform(({value}) => value === "true" || value === true)
    @IsBoolean()
    hasDiscount?: boolean
    
    @IsOptional()
    @Type(() => Number)
    @Min(0)
    @Max(5)
    rating?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 6;
}