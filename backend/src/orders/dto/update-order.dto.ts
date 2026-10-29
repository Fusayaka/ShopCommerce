import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto.js';
import { IsEnum, IsOptional } from 'class-validator';
import { $Enums, OrderStatus, PaymentMethod } from '@prisma/client';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsEnum(OrderStatus, { message: 'Invalid status' })
  status?: OrderStatus;

  @IsOptional()
  @IsEnum(PaymentMethod, { message: "Invalid Payment Method"})
  paymentMethod?: PaymentMethod;
}