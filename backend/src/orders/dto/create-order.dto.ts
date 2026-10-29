import { PaymentMethod } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateOrderDto {
    @IsNotEmpty({message: "Payment Method must not empty"})
    @IsEnum(PaymentMethod, {message: "Invalid Payment Method"})
    paymentMethod: PaymentMethod;

    @IsString()
    @IsOptional()
    promoCode?: string;

    @IsOptional()
    @IsNumber()
    deliveryFee: number;
}
