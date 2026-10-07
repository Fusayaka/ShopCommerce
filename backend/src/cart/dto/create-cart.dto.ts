import { Color as ItemColor, ItemSize } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, Min } from "class-validator";

export class CreateCartItemDto {
    @IsNumber()
    @IsNotEmpty()
    productId: number;
    
    @IsNumber()
    @Min(1)
    quantity: number;

    @IsEnum(ItemColor)
    color: ItemColor;

    @IsEnum(ItemSize)
    size: ItemSize;
}