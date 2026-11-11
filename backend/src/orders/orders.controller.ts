import { 
  Controller, Get, Post, Patch, Body, Param, ParseIntPipe, UseGuards
} from '@nestjs/common';
import { OrdersService } from './orders.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { UserRole, type User } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RolesGuard } from '../guards/roles.guard.js';
import { CreateRedeliveryOrderDto } from './dto/create-redelivery-order.dto.js';
import { UpdateRedeliveryOrderDto } from './dto/update-redelivery-order.dto.js';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // 1. POST /orders
  @Post()
  @UseGuards(JwtAuthGuard)
  createOrder(
    @CurrentUser('id') userId: number,
    @Body() createOrderDto: CreateOrderDto, 
  ) {
    return this.ordersService.createOrder(userId, createOrderDto);
  }

  @Post(':id/redelivery')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.manager)
  createRedeliveryOrder(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) orderId: number,
    @Body() createRedeliveryDto: CreateRedeliveryOrderDto
  ){
    return this.ordersService.createRedelivery(user, orderId, createRedeliveryDto);
  }

  // GET /orders/:id/redelivery
  @Get(':id/redelivery')
  @UseGuards(JwtAuthGuard)
  getOrderRedeliveries(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    const isAdminOrManager = !(user.role == UserRole.customer);
    return this.ordersService.getOrderRedeliveries(user.id, orderId, isAdminOrManager);
  }

  // GET /orders/redelivery/:redeliveryId
  @Get('redelivery/:redeliveryId')
  @UseGuards(JwtAuthGuard)
  getRedeliveryById(
    @CurrentUser() user: User,
    @Param('redeliveryId', ParseIntPipe) redeliveryId: number,
  ) {
    const isAdminOrManager = !(user.role == UserRole.customer);
    return this.ordersService.getRedeliveryById(user.id, redeliveryId, isAdminOrManager);
  }

  // 2. GET /orders
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getUserOrders(
    @CurrentUser('id') userId: number,
  ) {
    return this.ordersService.getUserOrders(userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.manager)
  getAllOrders() {
    return this.ordersService.getAllOrders();
  }

  // 3. GET /orders/:id
  @Get(':id')
  getOrderById(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number, 
  ) {
    const isAdminOrManager = !(user.role == UserRole.customer);
    return this.ordersService.getOrderById(user.id, id, isAdminOrManager);
  }

  // 4. PATCH /orders/:id
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.manager)
  updateOrder(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.updateOrder(id, updateOrderDto);
  }

  @Patch('redelivery/:redeliveryId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.manager)
  updateRedelivery(
    @Param('redeliveryId', ParseIntPipe) redeliveryId: number,
    @Body() updateRedeliveryDto: UpdateRedeliveryOrderDto,
  ) {
    return this.ordersService.updateRedelivery(redeliveryId, updateRedeliveryDto);
  }
}