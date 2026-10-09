import { Injectable, NotFoundException } from '@nestjs/common';
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
  }

  async findAll(query: GetCommentQueryDto) {
    const comments = await this.prisma.comment.findMany({
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
    if (!comments) throw new NotFoundException("Comment not found");
    return comments;
  }

  async findOne(id: number) {
    const comment = await this.prisma.comment.findUnique({
      where: {id}
    });
    if (!comment) throw new NotFoundException("Comment not found");
    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    // Rating is locked so that Product does not need update.
    const comment = await this.prisma.comment.update({
      where: {id},
      data: updateCommentDto,
    });
    if (!comment) throw new NotFoundException("Can not update: Comment not found");
    return comment;
  }

  async remove(id: number) {
    const comment = await this.prisma.comment.delete({where: {id}});
    if (!comment) throw new NotFoundException("Can not remove: Comment not found");
    return comment;
  }
}
