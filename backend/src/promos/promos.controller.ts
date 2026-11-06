import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PromosService } from './promos.service.js';
import { CreatePromoDto } from './dto/create-promo.dto.js';
import { UpdatePromoDto } from './dto/update-promo.dto.js';
import { ValidatePromoDto } from './dto/validate-promo.dto.js';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { RolesGuard } from '../guards/roles.guard.js';
import { UserRole } from '@prisma/client';
import { Public } from '../common/decorators/public.decorator.js';

@Controller('promos')
export class PromosController {
  constructor(private readonly promosService: PromosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.manager)
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.manager)
  @Get()
  findAll(){
    return this.promosService.getAllCode();
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.manager)
  update(@Body() updatePromoDto: UpdatePromoDto) {
    return this.promosService.update(updatePromoDto);
  }

  @Delete(':code')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin, UserRole.manager)
  remove(@Param('code') code: string) {
    return this.promosService.remove(code);
  }
}
