import { Controller, Get, Post, Body, Delete, Param, Query, Patch, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service.js';
import type { UploadableFile } from '../cloudinary/cloudinary.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { UpsertStockDto } from './dto/upsert-stock.dto.js';
import { UpdateStockDto } from './dto/update-stock.dto.js';
import { GetStockDto } from './dto/get-stock.dto.js';
import { GetProductsQueryDto } from './dto/get-product.dto.js';
import { Public } from '../common/decorators/public.decorator.js';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { UserRole } from '@prisma/client';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  findAll(@Query() query: GetProductsQueryDto) {
    return this.productsService.findAll(query);
  }

  @Public()
  @Get('price')
  getRoundedRange(){
    return this.productsService.getRoundedPriceRange();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Public()
  @Get(':id/stock')
  getStock(@Param('id') id: string, @Query() query: GetStockDto) {
    return this.productsService.getStock(+id, query);
  }

  @Public()
  @Get(':id/related')
  getRelated(@Param('id') id: string) {
    return this.productsService.getRelated(+id);
  }

  @Post('image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.manager)
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file?: UploadableFile & { size?: number }) {
    return this.productsService.uploadImage(file);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.manager)
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Post(':id/stocks')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.manager)
  upsertStock(
    @Param('id') id: string,
    @Body() dto: UpsertStockDto,
  ) {
    return this.productsService.upsertStock(+id, dto);
  }

  @Patch(':id/stocks/:stockId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.manager)
  updateStock(
    @Param('id') id: string,
    @Param('stockId') stockId: string,
    @Body() dto: UpdateStockDto,
  ) {
    return this.productsService.updateStock(+id, +stockId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.manager)
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.manager)
  removeProduct(@Param('id') id: string) {
    return this.productsService.removeProduct(+id);
  }

  @Delete(':id/:stockId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.manager)
  removeVariant(
    @Param('id') id: string,
    @Param('stockId') stockId: string,
  ) {
    return this.productsService.removeVariant(+id, +stockId);
  }
}
