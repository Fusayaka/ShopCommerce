import { IsInt } from "class-validator";

export class DeleteCartItemDto {
    @IsInt()
    stockId: number;
}
