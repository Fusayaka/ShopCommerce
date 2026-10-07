import { Injectable } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart.dto.js';
import { UpdateCartItemDto } from './dto/update-cart.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { DeleteCartItemDto } from './dto/delete-cart.dto.js';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  // Return the user's cart and its items (prices resolved from products).
  async getCartByUserId(userId: number) {
    // TODO: implement
    return this.prisma.cart.upsert({
      where: {userId},
      create: {userId},
      update: {},
      include: {
        items: {
          include: {
            product: true,
          }
        }
      }
    });
  }

  // Add an item to the cart, or merge quantity if the same variant exists.
  async addItem(userId: number, dto: CreateCartItemDto) {
    // TODO: implement
    const cart = await this.getCartByUserId(userId);
    return this.prisma.cartItem.upsert({
      where: {
        cartId_productId_size_color:{
          cartId: cart.id,
          size: dto.size,
          color: dto.color,
          productId: dto.productId,
        },
      },
      create: {
        cartId: cart.id,
        productId: dto.productId,
        size: dto.size,
        color: dto.color,
        quantity: dto.quantity,
      },
      update: {
        quantity: {
          increment: dto.quantity
        }
      },
    });
  }

  // Update a cart item quantity.
  async updateItem(userId: number, dto: UpdateCartItemDto) {
    if (dto.quantity <= 0) return this.removeItem(userId, dto);
    const cart = await this.getCartByUserId(userId);
    // TODO: implement handler
    return this.prisma.cartItem.update({
      where: {
        cartId_productId_size_color: {
          cartId: cart.id,
          productId: dto.productId,
          color: dto.color,
          size: dto.size
        }
      },
      data: {
        quantity: dto.quantity
      }
    });
  }

  // Remove one item from the cart.
  async removeItem(userId: number, dto: DeleteCartItemDto) {
    const cart = await this.getCartByUserId(userId);
    // TODO: implement handler for not found (UI may not know but API know or do sth else)
    return this.prisma.cartItem.delete({
      where: {
        cartId_productId_size_color: {
          cartId: cart.id,
          productId: dto.productId,
          color: dto.color,
          size: dto.size
        }
      }
    });
  }

  // Remove all items from the user's cart.
  async clearCart(userId: number) {
    // TODO: implement
    const cartId = (await this.getCartByUserId(userId)).id;
    // TODO: implement handler
    return this.prisma.cartItem.deleteMany({
      where: {cartId}
    });
  }

  // Delete Cart of user
  async deleteCart(userId: number){
    this.clearCart(userId);
    return this.prisma.cart.delete({
      where: {userId}
    });
  }
}
