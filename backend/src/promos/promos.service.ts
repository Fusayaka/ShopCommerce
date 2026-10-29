import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePromoDto } from './dto/create-promo.dto.js';
import { UpdatePromoDto } from './dto/update-promo.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

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
