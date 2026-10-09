import { Color, ItemSize } from '@prisma/client';
import { IsEnum } from 'class-validator';


// Both required: pick an exact variant by size + color.
export class GetStockDto {
    @IsEnum(ItemSize)
    size: ItemSize;

    @IsEnum(Color)
    color: Color;
}
