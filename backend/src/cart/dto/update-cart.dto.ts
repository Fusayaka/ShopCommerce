import { Color as ItemColor, ItemSize} from "@prisma/client";
import { IsEnum, IsNumber, Min } from "class-validator";

export class UpdateCartItemDto{
    @IsNumber()
    quantity: number;

    @IsEnum(ItemColor)
    color: ItemColor;

    @IsEnum(ItemSize)
    size: ItemSize;

    @IsNumber()
    productId: number;
}
