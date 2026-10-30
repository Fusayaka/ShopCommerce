import { PaymentMethod } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

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
    deliveryFee: number;
}
