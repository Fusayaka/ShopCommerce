import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { CreateRedeliveryOrderDto } from './dto/create-redelivery-order.dto.js';
import { UpdateRedeliveryOrderDto } from './dto/update-redelivery-order.dto.js';
import { Prisma, OrderStatus, type User } from '@prisma/client';

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

  async getAllOrders(){
    return this.prisma.order.findMany({
      include: { 
        user: {
          select: {
            avatar: true,
            name: true,
            contact: true,
            address: true,      // As delivered based on user's address
            email: true,
          }
        }, 
        items: true 
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderById(userId: number, orderId: number, isAdminOrManager: boolean) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Not found Order ID ${orderId}!`);
    }

    if (!isAdminOrManager && order.userId !== userId){
      throw new ForbiddenException("User is not allowed to see another user's order!")
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

    if (dto.status && dto.status !== existingOrder.status) {
      this.assertValidRedeliveryTransition(existingOrder.status, dto.status);
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

  async createRedelivery(user: User, orderId: number, dto: CreateRedeliveryOrderDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: { address: true, contact: true },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Not found Order ID ${orderId}!`);
    }

    if (order.status === 'cancelled') {
      throw new BadRequestException(
        `Cannot create a redelivery for an order with status "${order.status}"!`,
      );
    }

    const redelivery = await this.prisma.redeliveryOrder.create({
      data: {
        order: { connect: { id: orderId } },
        createdBy: { connect: { id: user.id } },
        reason: dto.reason,
        note: dto.note ?? null,
        address: dto.address ?? order.address ?? order.user.address,
        contact: dto.contact ?? order.contact ?? order.user.contact,
        total: order.total,
        paymentMethod: dto.paymentMethod ?? order.paymentMethod ?? 'delivery',
      },
    });

    return {
      success: true,
      message: 'Redelivery order created successfully!',
      data: redelivery,
    };
  }

  async getOrderRedeliveries(userId: number, orderId: number, isAdminOrManager: boolean) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException(`Not found Order ID ${orderId}!`);
    }

    if (!isAdminOrManager && order.userId !== userId) {
      throw new ForbiddenException("User is not allowed to see another user's redelivery orders!");
    }

    const redeliveries = await this.prisma.redeliveryOrder.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: redeliveries,
    };
  }

  async getRedeliveryById(userId: number, redeliveryId: number, isAdminOrManager: boolean) {
    const redelivery = await this.prisma.redeliveryOrder.findUnique({
      where: { id: redeliveryId },
      include: {
        order: {
          include: { items: true },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!redelivery) {
      throw new NotFoundException(`Not found Redelivery Order ID ${redeliveryId}!`);
    }

    if (!isAdminOrManager && redelivery.order.userId !== userId) {
      throw new ForbiddenException("User is not allowed to see another user's redelivery order!");
    }

    return {
      success: true,
      data: redelivery,
    };
  }

  async updateRedelivery(redeliveryId: number, dto: UpdateRedeliveryOrderDto) {
    const existingOrder = await this.prisma.redeliveryOrder.findUnique({
      where: { id: redeliveryId },
    });

    if (!existingOrder) {
      throw new NotFoundException(`Not found Redelivery Order ID ${redeliveryId}!`);
    }

    if (dto.status && dto.status !== existingOrder.status) {
      this.assertValidRedeliveryTransition(existingOrder.status, dto.status);
    }

    const updated = await this.prisma.redeliveryOrder.update({
      where: { id: redeliveryId },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: 'Redelivery order updated successfully!',
      data: updated,
    };
  }

  private assertValidRedeliveryTransition(from: OrderStatus, to: OrderStatus) {
    const allowed: Record<OrderStatus, OrderStatus[]> = {
      redelivery: ['processing', 'cancelled'],
      processing: ['shipping', 'cancelled'],
      shipping: ['delivered', 'cancelled'],
      pending: ['processing', 'cancelled'],
      delivered: [],
      cancelled: [],
    };

    if (!allowed[from]?.includes(to)) {
      throw new BadRequestException(
        `Invalid redelivery status transition: ${from} -> ${to}`,
      );
    }
  }
}