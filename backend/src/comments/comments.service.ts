import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { GetCommentQueryDto } from './dto/get-comment.dto.js';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService){}

  create(userId: number, createCommentDto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: { ...createCommentDto, userId },
      include: {
        user: {
          select: {
            id: true,
            avatar: true,
            name: true
          }
        }
      }
    });
  }

  // Người dùng chỉ được đánh giá sản phẩm đã mua và chưa đánh giá.
  async checkEligibility(userId: number, productId: number) {
    const purchased = await this.prisma.orderItem.findFirst({
      where: {
        order: { userId, status: 'delivered' },
        stock: { productId },
      },
      select: { id: true },
    });
    if (!purchased) {
      return {
        canReview: false,
        reason: 'You can only review products you have purchased.',
      };
    }

    const existing = await this.prisma.comment.findFirst({
      where: { userId, productId },
      select: { id: true },
    });
    if (existing) {
      return {
        canReview: false,
        reason: 'You have already reviewed this product.',
      };
    }

    return { canReview: true };
  }

  async findAll(query: GetCommentQueryDto) {
    const { productId, userId } = query;

    const [userComment, otherComments] = await Promise.all([
      userId
        ? this.prisma.comment.findFirst({
            where: { productId, userId },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true,
                },
              },
            },
          })
        : null,

      this.prisma.comment.findMany({
        where: {
          productId,
          ...(userId && { NOT: { userId } }),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: 50,
      }),
    ]);

    const allComments = userComment
      ? [userComment, ...otherComments]
      : otherComments;

    return allComments;
  }

  async findOne(id: number) {
    const comment = await this.prisma.comment.findUnique({
      where: {id}
    });
    if (!comment) throw new NotFoundException("Comment not found");
    return comment;
  }

  async update(id: number, userId: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findFirst({where: {id}});
    if (!comment) throw new NotFoundException("Can not update: Comment not found");
    if (comment.userId !== userId) throw new ForbiddenException("User is not allowed to edit another user's review!")

    return await this.prisma.comment.update({
      where: {id},
      data: updateCommentDto,
    });
  }

  async remove(id: number, user: User) {
    const comment = await this.prisma.comment.findFirst({where: {id}});
    if (!comment) throw new NotFoundException("Can not remove: Comment not found");
    if (comment.userId !== user.id && user.role !== UserRole.admin) throw new ForbiddenException("User is not allowed to delete another user's review!")
    return this.prisma.comment.delete({where: {id}});
  }
}
