import { Controller, Get, Post, Body, Delete, Param, Query, Patch } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { UpsertStockDto } from './dto/upsert-stock.dto.js';
import { GetStockDto } from './dto/get-stock.dto.js';
import { GetProductsQueryDto } from './dto/get-product.dto.js';
import { Public } from '../common/decorators/public.decorator.js';

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

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Post(':id/stocks')
  upsertStock(
    @Param('id') id: string,
    @Body() dto: UpsertStockDto,
  ) {
    return this.productsService.upsertStock(+id, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
