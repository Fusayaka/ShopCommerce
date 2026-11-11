import { PaymentMethod } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRedeliveryOrderDto {
    @IsString()
    @IsNotEmpty({ message: 'Reason must not be empty' })
    reason: string;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    contact?: string;

    @IsOptional()
    @IsEnum(PaymentMethod, { message: 'Invalid Payment Method' })
    @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
    paymentMethod?: PaymentMethod;
}
