import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CartService } from './cart.service.js';
import { CreateCartItemDto } from './dto/create-cart.dto.js';
import { UpdateCartItemDto } from './dto/update-cart.dto.js';
import { DeleteCartItemDto } from './dto/delete-cart.dto.js';

@Controller('carts')
// @UseGuards()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Get the current user's cart with its items.
  @Get()
  getCart(@Query('userId') userId: string) {
    return this.cartService.getCartByUserId(+userId);
  }

  // Add a product (size/color/quantity) to the user's cart.
  @Post('items')
  addItem(
    @Query('userId') userId: string,
    @Body() createCartDto: CreateCartItemDto
  ) {
    return this.cartService.addItem(+userId, createCartDto);
  }

  // Update a cart item quantity.
  @Patch('items')
  updateItem(
    @Query('userId') userId: string,
    @Body() updateCartDto: UpdateCartItemDto) {
    return this.cartService.updateItem(+userId, updateCartDto);
  }

  // Remove a single item from the cart.
  @Delete('items')
  removeItem(
    @Query('userId') userId: string,
    @Body() deleteCartItemDto: DeleteCartItemDto) {
    return this.cartService.removeItem(+userId, deleteCartItemDto);
  }

  // Empty the user's cart.
  @Delete('items/all')
  clearCart(@Query('userId') userId: string) {
    return this.cartService.clearCart(+userId);
  }

  // Delete user's cart.
  @Delete()
  deleteCart(@Query('userId') userId: string){
    return this.cartService.deleteCart(+userId);
  }
}
