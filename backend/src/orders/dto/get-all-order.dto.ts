import { OrderStatus } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional, IsString, IsIn } from "class-validator";
import { Type } from "class-transformer";

export class GetAllOrderDto{
    @IsString()
    @IsOptional()
    search?: string;

    @IsEnum(OrderStatus)
    @IsOptional()
    status?: OrderStatus

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit: number = 10;

    @IsOptional()
    @IsIn(['createdAt', 'updatedAt', 'status'])
    sortBy?: 'createdAt' | 'updatedAt' | 'status' = 'updatedAt';

    @IsOptional()
    @IsIn(['asc', 'desc'])
    sortOrder?: 'asc' | 'desc' = 'desc';
}