import { Injectable } from '@nestjs/common';
import { CreateCartItemDto } from './dto/create-cart.dto.js';
import { UpdateCartItemDto } from './dto/update-cart.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { DeleteCartItemDto } from './dto/delete-cart.dto.js';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCartByUserId(userId: number) {
    return this.prisma.cart.upsert({
      where: {userId},
      create: {userId},
      update: {},
      include: {
        items: {
          include: {
            stock: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  }

  // Add an item to the cart, or merge quantity if the same variant exists.
  async addItem(userId: number, dto: CreateCartItemDto) {
    const cart = await this.getCartByUserId(userId);
    return this.prisma.cartItem.upsert({
      where: {
        cartId_stockId: {
          cartId: cart.id,
          stockId: dto.stockId,
        },
      },
      create: {
        cartId: cart.id,
        stockId: dto.stockId,
        quantity: dto.quantity,
      },
      update: {
        quantity: {
          increment: dto.quantity,
        },
      },
    });
  }

  // Update a cart item quantity.
  async updateItem(userId: number, dto: UpdateCartItemDto) {
    if (dto.quantity <= 0) return this.removeItem(userId, dto);
    const cart = await this.getCartByUserId(userId);
    return this.prisma.cartItem.update({
      where: {
        cartId_stockId: {
          cartId: cart.id,
          stockId: dto.stockId,
        },
      },
      data: {
        quantity: dto.quantity,
      },
    });
  }

  // Remove one item from the cart.
  async removeItem(userId: number, dto: DeleteCartItemDto) {
    const cart = await this.getCartByUserId(userId);
    return this.prisma.cartItem.delete({
      where: {
        cartId_stockId: {
          cartId: cart.id,
          stockId: dto.stockId,
        },
      },
    });
  }

  // Remove all items from the user's cart.
  async clearCart(userId: number) {
    const cartId = (await this.getCartByUserId(userId)).id;
    return this.prisma.cartItem.deleteMany({
      where: {cartId}
    });
  }

  // Delete Cart of user (cart_items cascade via the FK).
  async deleteCart(userId: number){
    return this.prisma.cart.delete({
      where: {userId}
    });
  }
}
