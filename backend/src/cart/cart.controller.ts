import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';
import { CartService } from './cart.service.js';
import { CreateCartItemDto } from './dto/create-cart.dto.js';
import { UpdateCartItemDto } from './dto/update-cart.dto.js';
import { DeleteCartItemDto } from './dto/delete-cart.dto.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // Get the current user's cart with its items.
  @Get()
  getCart(@CurrentUser('id') userId: number) {
    return this.cartService.getCartByUserId(userId);
  }

  // Add a product (size/color/quantity) to the user's cart.
  @Post('items')
  addItem(
    @CurrentUser('id') userId: number,
    @Body() createCartDto: CreateCartItemDto
  ) {
    return this.cartService.addItem(userId, createCartDto);
  }

  // Update a cart item quantity.
  @Patch('items')
  updateItem(
    @CurrentUser('id') userId: number,
    @Body() updateCartDto: UpdateCartItemDto) {
    return this.cartService.updateItem(userId, updateCartDto);
  }

  // Remove a single item from the cart.
  @Delete('items')
  removeItem(
    @CurrentUser('id') userId: number,
    @Body() deleteCartItemDto: DeleteCartItemDto) {
    return this.cartService.removeItem(userId, deleteCartItemDto);
  }

  // Clear the user's cart.
  @Delete('items/all')
  clearCart(@CurrentUser('id') userId: number) {
    return this.cartService.clearCart(userId);
  }

  // Delete user's cart.
  @Delete()
  deleteCart(@CurrentUser('id') userId: number){
    return this.cartService.deleteCart(userId);
  }

  // Get total items in user's cart.
  @Get('items/count')
  getTotalItems(@CurrentUser('id') userId: number){
    return this.cartService.getTotalItems(userId);
  }

  @Get('items/minicart')
  getMiniCart(@CurrentUser('id') userId: number){
    return this.cartService.getMiniCart(userId);
  }
}
