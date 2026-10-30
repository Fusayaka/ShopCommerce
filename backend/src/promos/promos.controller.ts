import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PromosService } from './promos.service.js';
import { CreatePromoDto } from './dto/create-promo.dto.js';
import { UpdatePromoDto } from './dto/update-promo.dto.js';
import { ValidatePromoDto } from './dto/validate-promo.dto.js';

@Controller('promos')
export class PromosController {
  constructor(private readonly promosService: PromosService) {}

  @Post()
  create(@Body() createPromoDto: CreatePromoDto) {
    return this.promosService.create(createPromoDto);
  }

  @Post('/validate')
  validate(@Body() validatePromoDto: ValidatePromoDto){
    return this.promosService.validateCode(validatePromoDto);
  }

  @Get(':code')
  findCode(@Param('code') code: string) {
    return this.promosService.getCode(code);
  }

  @Get()
  findAll(){
    return this.promosService.getAllCode();
  }

  @Patch()
  update(@Body() updatePromoDto: UpdatePromoDto) {
    return this.promosService.update(updatePromoDto);
  }

  @Delete(':code')
  remove(@Param('code') code: string) {
    return this.promosService.remove(code);
  }
}
