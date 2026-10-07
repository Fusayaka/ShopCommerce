import { Color as ItemColor, ItemSize} from "@prisma/client";
import { IsEnum, IsNumber } from "class-validator";

export class DeleteCartItemDto{
    @IsEnum(ItemColor)
    color: ItemColor;

    @IsEnum(ItemSize)
    size: ItemSize;

    @IsNumber()
    productId: number;
}
