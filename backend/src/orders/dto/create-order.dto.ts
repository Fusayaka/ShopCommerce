import { PaymentMethod } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateOrderDto {
    @IsNotEmpty({message: "Payment Method must not empty"})
    @IsEnum(PaymentMethod, {message: "Invalid Payment Method"})
    paymentMethod: PaymentMethod;

    @IsString()
    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
    promoCode?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    deliveryFee: number;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    address?: string;

    @IsOptional()
    @IsString()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    contact?: string;
}
