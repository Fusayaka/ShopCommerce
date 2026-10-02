import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { GetProductsQueryDto } from './dto/get-product.dto.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService){}

  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  async findAll(query: GetProductsQueryDto) {
    const { 
      search,
      minPrice,
      maxPrice,
      hasDiscount,
      rating, 
      page = 1, 
      limit = 6
    } = query;

    const skip = (page - 1) * limit;

    const conditions: Prisma.ProductWhereInput[] = [];

    if (search){
      conditions.push({
          title: {
            contains: search,
            mode: 'insensitive' as Prisma.QueryMode,
          }
        });
    }

    if (minPrice !== undefined || maxPrice !== undefined){
      conditions.push({
        OR: [
          {
            promotionPrice: {
              not: null,
              ...(minPrice !== undefined ? {gte: minPrice} : {}),
              ...(maxPrice !== undefined ? {lte: maxPrice} : {}),
            },
          },
          {
            promotionPrice: null,
            originalPrice: {
              ...(minPrice !== undefined ? {gte: minPrice} : {}),
              ...(maxPrice !== undefined ? {lte: maxPrice} : {}),
            }
          }
        ]
      })
    }

    if (hasDiscount){
      conditions.push({
        promotionPrice: {
          not: null,
        }
      })
    }

    if (rating){
      conditions.push({
        rating:{
          gte: rating
        }
      })
    }

    const where: Prisma.ProductWhereInput = conditions.length > 0 ? {AND: conditions}: {}
    
    const data = await this.prisma.product.findMany({
      where: where,
      skip: skip,
      take: limit,
      orderBy: {rating: 'desc'}
    })

    const total = await this.prisma.product.count({where});
    
    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit) || 1
      }
    };
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: {id}
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: {id},
      data: updateProductDto
    });
  }

  remove(id: number) {
    return this.prisma.product.delete({
      where: {id}
    });


    // TO BE IMPLEMENTED



    
  }
}
