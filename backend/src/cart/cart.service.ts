import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    const stock = await this.prisma.productStock.findUnique({
      where: { id: dto.stockId },
    });
    if (!stock) throw new NotFoundException('Can not add: Product variant not found');
    if (stock.stock <= 0) throw new BadRequestException('This variant is out of stock');

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
    const where = { cartId_stockId: { cartId: cart.id, stockId: dto.stockId } };

    const item = await this.prisma.cartItem.findUnique({ where });
    if (!item) throw new NotFoundException('Can not update: Cart item not found');

    return this.prisma.cartItem.update({
      where,
      data: {
        quantity: dto.quantity,
      },
    });
  }

  // Remove one item from the cart.
  async removeItem(userId: number, dto: DeleteCartItemDto) {
    const cart = await this.getCartByUserId(userId);
    const where = { cartId_stockId: { cartId: cart.id, stockId: dto.stockId } };

    const item = await this.prisma.cartItem.findUnique({ where });
    if (!item) throw new NotFoundException('Can not remove: Cart item not found');

    return this.prisma.cartItem.delete({ where });
  }

  // Remove all items from the user's cart.
  async clearCart(userId: number) {
    const cart = await this.getCartByUserId(userId);
    if (!cart) throw new NotFoundException('Can not clear: Cart not found');
    return this.prisma.cartItem.deleteMany({
      where: {cartId: cart.id}
    });
  }

  // Delete Cart of user (cart_items cascade via the FK).
  async deleteCart(userId: number){
    const cart = await this.prisma.cart.findUnique({
      where: {userId}
    });
    if (!cart) throw new NotFoundException('Can not delete: Cart not found');

    return this.prisma.cart.delete({
      where: {userId}
    });
  }
}
