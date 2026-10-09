import { IsInt, IsNumber, Min } from "class-validator";

export class CreateCartItemDto {
    @IsInt()
    stockId: number;

    @IsNumber()
    @Min(1)
    quantity: number;
}
