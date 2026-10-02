import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { GetCommentQueryDto } from './dto/get-comment.dto.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService){}

  create(createCommentDto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: createCommentDto,
    });

    // TO BE IMPLEMENTED



  }

  async findAll(query: GetCommentQueryDto) {
    return this.prisma.comment.findMany({
      where: {
        productId: query.productId,
        userId: query.userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 50,
    });
  }

  findOne(id: number) {
    return this.prisma.comment.findUnique({
      where: {id}
    });
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    // Rating is locked so that Product does not need update.
    return this.prisma.comment.update({
      where: {id},
      data: updateCommentDto,
    });
  }

  async remove(id: number) {
    return this.prisma.comment.delete({where: {id}})

    // TO BE IMPLEMENTED
    // return this.prisma.$transaction(async (tx) => {
    //   const comment = await tx.comment.findUnique({where: {id}})
    // });
  }
}
