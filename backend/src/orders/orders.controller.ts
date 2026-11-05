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
  @UseGuards(JwtAuthGuard)
  updateOrder(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateOrderDto: UpdateOrderDto,
    @CurrentUser() user: User
  ) {
    return this.ordersService.updateOrder(id, updateOrderDto, user.role);
  }
}