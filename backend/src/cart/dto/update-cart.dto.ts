import { IsInt, IsNumber } from "class-validator";

export class UpdateCartItemDto {
    @IsInt()
    stockId: number;

    @IsNumber()
    quantity: number;
}
