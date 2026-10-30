import { 
  Controller, Get, Post, Patch, Body, Param, ParseIntPipe, Res, Req
} from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // 1. POST /orders
  @Post()
  createOrder(
    @CurrentUser('id') userId: number,
    @Body() createOrderDto: CreateOrderDto, 
  ) {
    return this.ordersService.createOrder(userId, createOrderDto);
  }

  // 2. GET /orders
  @Get()
  getUserOrders(@CurrentUser('id') userId: number,) {
    return this.ordersService.getUserOrders(userId);
  }

  // 3. GET /orders/:id
  @Get(':id')
  getOrderById(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number, 
  ) {
    return this.ordersService.getOrderById(userId, id);
  }

  // 4. PATCH /orders/:id
  @Patch(':id')
  updateOrder(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    return this.ordersService.updateOrder(id, updateOrderDto);
  }
}