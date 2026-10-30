import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePromoDto } from './dto/create-promo.dto.js';
import { UpdatePromoDto } from './dto/update-promo.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ValidatePromoDto } from './dto/validate-promo.dto.js';

@Injectable()
export class PromosService {
  constructor(private readonly prisma: PrismaService){}

  async create(dto: CreatePromoDto) {
    const promo = await this.prisma.promoCodes.findUnique({
      where: {code: dto.code}
    });
    if (promo) throw new ConflictException(`Code ${dto.code} already exists`);

    return this.prisma.promoCodes.create({
      data: {
        code: dto.code,
        discountNum: dto.discountNum,
        discountPer: dto.discountPer,
        maxDiscountNum: dto.maxDiscountNum,
        minToApply: dto.minToApply,
        expiredAt: dto.expiredAt
      }
    })
  }

  async getCode(code: string) {
    const code_details = await this.prisma.promoCodes.findUnique({where: {code}});
    if (!code_details) throw new NotFoundException(`Not found code ${code}`);
    return code_details;
  }

  getAllCode() {
    return this.prisma.promoCodes.findMany({
      select: {
        code: true,
      }
    });
  }

  async validateCode(dto: ValidatePromoDto){
    const { code, subtotal } = dto;
    const promo = await this.prisma.promoCodes.findUnique({where: {code: code.trim()}});
    if (!promo) return {
        isValid: false,
        message: "Code not found",
        discount: 0
      };;

    if (promo.expiredAt){
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      if (now > new Date(promo.expiredAt)) return {
        isValid: false,
        message: "Expired Code",
        discount: 0
      };
    }

    if (promo.minToApply && subtotal < promo.minToApply) return {
        isValid: false,
        message: `Order should be at least $${promo.minToApply} to use this code`,
        discount: 0
      };

    let discount = 0;
    if (promo.discountNum && Number(promo.discountNum) > 0){
      discount = Number(promo.discountNum);
    }
    else if (promo.discountPer && promo.discountPer > 0){
      let calculated = subtotal * promo.discountPer / 100;
      if (promo.maxDiscountNum && Number(promo.maxDiscountNum) > 0) {
        calculated = Math.min(calculated, Number(promo.maxDiscountNum));
      }

      discount = calculated;
    }

    return {
      isValid: true,
      message: "Apply success",
      discount,
    }
  }

  async update(dto: UpdatePromoDto) {
    const code_details = await this.prisma.promoCodes.findUnique({where: {code: dto.code}});
    if (!code_details) throw new NotFoundException(`Not found code ${dto.code}`);

    const {code, ...data} = dto;
    return this.prisma.promoCodes.update({
      where: {code},
      data: {data}
    })
  }

  async remove(code: string) {
    const code_details = await this.prisma.promoCodes.findUnique({where: {code}});
    if (!code_details) throw new NotFoundException(`Not found code ${code}`);

    return this.prisma.promoCodes.delete({where: {code}})
  }
}