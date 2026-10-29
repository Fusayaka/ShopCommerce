import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { Color, Prisma, ItemSize } from '@prisma/client';

interface OrderItemInput {
  stockId: number;
  title: string;
  image: string | null;
  size: ItemSize;
  color: Color;
  quantity: number;
  priceAtPurchase: Prisma.Decimal;
}
@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(userId: number, dto: CreateOrderDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const userCart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            stock: {
              include: {
                product: {
                  select: {
                    title: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!userCart || !userCart.items || userCart.items.length === 0) {
      throw new BadRequestException('Empty Cart!');
    }

    let subtotal = new Prisma.Decimal(0);
    const orderItemsData: OrderItemInput[] = [];

    for (const cartItem of userCart.items) {
      if (!cartItem.stock || !cartItem.stock.product) {
        throw new BadRequestException(`Product in Cart not exist!`);
      }

      if (cartItem.stock.stock < cartItem.quantity) {
        throw new BadRequestException(`Sản phẩm "${cartItem.stock.product.title}" không đủ số lượng trong kho!`);
      }

      const price = cartItem.stock.promotionPrice 
        ? new Prisma.Decimal(cartItem.stock.promotionPrice) 
        : new Prisma.Decimal(cartItem.stock.originalPrice);

      const itemTotal = price.mul(cartItem.quantity);
      subtotal = subtotal.add(itemTotal);

      orderItemsData.push({
        stockId: cartItem.stockId,
        title: cartItem.stock.product.title,
        image: cartItem.stock.product.image,
        size: cartItem.stock.size,
        color: cartItem.stock.color,
        quantity: cartItem.quantity,
        priceAtPurchase: price,
      });
    }

    let discount = new Prisma.Decimal(0);

    if (dto.promoCode) {
      const promo = await this.prisma.promoCodes.findUnique({
        where: { code: dto.promoCode },
      });

      if (!promo) {
        throw new BadRequestException(`Code "${dto.promoCode}" not found!`);
      }

      if (promo.expiredAt && new Date(promo.expiredAt) < new Date()) {
        throw new BadRequestException('Expired Code!');
      }

      if (promo.minToApply && subtotal.lessThan(promo.minToApply)) {
        throw new BadRequestException(`Order should be at least ${promo.minToApply} USD to use this code!`);
      }

      if (promo.discountNum) {
        discount = new Prisma.Decimal(promo.discountNum);
      } 
      else if (promo.discountPer) {
        const percent = new Prisma.Decimal(promo.discountPer).div(100);
        discount = subtotal.mul(percent);

        if (promo.maxDiscountNum && discount.greaterThan(promo.maxDiscountNum)) {
          discount = new Prisma.Decimal(promo.maxDiscountNum);
        }
      }
    }

    const deliveryFee = dto.deliveryFee ? new Prisma.Decimal(dto.deliveryFee) : new Prisma.Decimal(0);

    if (discount.greaterThan(subtotal)) {
      discount = subtotal;
    }

    const newOrder = await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          status: 'pending',
          subtotal,
          discount,
          deliveryFee,
          promoCode: dto.promoCode || null,
          paymentMethod: dto.paymentMethod,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });

      for (const item of userCart.items) {
        await tx.productStock.update({
          where: { id: item.stockId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({
        where: { cartId: userCart.id },
      });

      return order;
    });

    return {
      success: true,
      message: 'Place order successfully!',
      data: newOrder,
    };
  }

  async getUserOrders(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      data: orders,
    };
  }

  async getOrderById(userId: number, orderId: number) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Not found Order ID ${orderId}!`);
    }

    return {
      success: true,
      data: order,
    };
  }

  async updateOrder(orderId: number, dto: UpdateOrderDto) {
    const existingOrder = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      throw new NotFoundException(`Not found Order ID ${orderId}!`);
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: dto,
      include: {
        items: true,
      },
    });

    return {
      success: true,
      message: 'Update succeessfully!',
      data: updatedOrder,
    };
  }
}