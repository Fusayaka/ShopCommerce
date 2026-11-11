import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '@prisma/client';
import { CreateRedeliveryOrderDto } from './create-redelivery-order.dto.js';

export class UpdateRedeliveryOrderDto extends PartialType(CreateRedeliveryOrderDto) {
    @IsOptional()
    @IsEnum(OrderStatus, { message: 'Invalid status' })
    status?: OrderStatus;
}
