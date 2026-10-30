import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { Color, Prisma, ItemSize } from '@prisma/client';

interface OrderItemInput {
  stock: {
    connect: {
      id: number;
    };
  };
  title: string;
  image: string | null;
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
        throw new BadRequestException(`Not enough "${cartItem.stock.product.title}" in stock!`);
      }

      const price = cartItem.stock.promotionPrice 
        ? new Prisma.Decimal(cartItem.stock.promotionPrice) 
        : new Prisma.Decimal(cartItem.stock.originalPrice);

      const itemTotal = price.mul(cartItem.quantity);
      subtotal = subtotal.add(itemTotal);

      orderItemsData.push({
        stock: {
          connect: {
            id: cartItem.stockId
          }
        },
        title: cartItem.stock.product.title,
        image: cartItem.stock.product.image,
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

      if (promo.expiredAt) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const promoExpiry = new Date(promo.expiredAt);
        promoExpiry.setHours(0, 0, 0, 0);

        if (promoExpiry < today) {
          throw new BadRequestException('Expired Code!');
        }
      }

      if (promo.minToApply && subtotal.lessThan(promo.minToApply)) {
        throw new BadRequestException(`Order should be at least $${promo.minToApply} to use this code!`);
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
      console.log(1);
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
      console.log(2);

      for (const item of userCart.items) {
        const updateStock = await tx.productStock.updateMany({
          where: { id: item.stockId, stock: { gte: item.quantity} },
          data: { stock: { decrement: item.quantity } },
        });

        if (updateStock.count === 0) throw new BadRequestException(`Not enough product in stock!`)
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