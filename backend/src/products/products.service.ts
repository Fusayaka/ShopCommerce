import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { UpsertStockDto } from './dto/upsert-stock.dto.js';
import { GetStockDto } from './dto/get-stock.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { GetProductsQueryDto } from './dto/get-product.dto.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService){}

  create(createProductDto: CreateProductDto) {
    const { stocks, ...productData } = createProductDto;

    // A variant created alongside the product needs full data (price + stock).
    const stockData = stocks?.map((s) => {
      if (s.originalPrice === undefined || s.stock === undefined) {
        throw new BadRequestException(
          'Each stock needs originalPrice and stock',
        );
      }
      return {
        size: s.size,
        color: s.color,
        originalPrice: s.originalPrice,
        promotionPrice: s.promotionPrice,
        stock: s.stock,
      };
    });

    return this.prisma.product.create({
      data: {
        ...productData,
        ...(stockData && stockData.length ? { stocks: { create: stockData } } : {}),
      },
      include: { stocks: true },
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
        stocks: {
          some: {
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
                },
              },
            ],
          },
        },
      })
    }

    if (hasDiscount){
      conditions.push({
        stocks: {
          some: {
            promotionPrice: {
              not: null,
            },
          },
        },
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
      orderBy: {rating: 'desc'},
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
      where: {id},
      include: { stocks: true },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    const { stocks, ...productData } = updateProductDto;
    return this.prisma.product.update({
      where: {id},
      data: productData,
    });
  }

  // Create a variant, or update an existing one by (size, color):
  //  - new variant         -> requires originalPrice + stock
  //  - body has price      -> reprice, keep stock
  //  - body has only stock -> increment stock
  async upsertStock(productId: number, dto: UpsertStockDto) {
    const { size, color, originalPrice, promotionPrice, stock } = dto;

    const existing = await this.prisma.productStock.findUnique({
      where: { productId_size_color: { productId, size, color } },
    });

    if (!existing) {
      if (originalPrice === undefined || stock === undefined) {
        throw new BadRequestException(
          'originalPrice and stock are required to create a new variant',
        );
      }
      return this.prisma.productStock.create({
        data: { productId, size, color, originalPrice, promotionPrice, stock },
      });
    }

    const priceProvided =
      originalPrice !== undefined || promotionPrice !== undefined;

    if (priceProvided) {
      // Reprice, keep current stock.
      return this.prisma.productStock.update({
        where: { id: existing.id },
        data: { originalPrice, promotionPrice },
      });
    }

    if (stock !== undefined) {
      // Stock-only: add to current stock.
      return this.prisma.productStock.update({
        where: { id: existing.id },
        data: { stock: { increment: stock } },
      });
    }

    throw new BadRequestException('Provide price fields or stock to update');
  }

  getStock(productId: number, query: GetStockDto) {
    const { size, color } = query;
    return this.prisma.productStock.findUnique({
      where: {
        productId_size_color: { productId, size, color },
      },
    });
  }

  remove(id: number) {
    return this.prisma.product.delete({
      where: {id}
    });
  }
}
