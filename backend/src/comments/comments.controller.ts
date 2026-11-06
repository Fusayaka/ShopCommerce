import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards, ForbiddenException } from '@nestjs/common';
import { CommentsService } from './comments.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';
import { GetCommentQueryDto } from './dto/get-comment.dto.js';
import { Public } from '../common/decorators/public.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { type User } from '@prisma/client';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser('id') userId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(userId, createCommentDto);
  }

  @Public()
  @Get()
  findAll(@Query() query: GetCommentQueryDto) {
    return this.commentsService.findAll(query);
  }

  // Check whether user can comment or not
  @UseGuards(JwtAuthGuard)
  @Get('eligibility')
  checkEligibility(
    @CurrentUser('id') userId: number,
    @Query('productId', ParseIntPipe) productId: number,
  ) {
    return this.commentsService.checkEligibility(userId, productId);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string, 
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser('id') userId: number
  ) {
    return this.commentsService.update(+id, userId, updateCommentDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: User
  ) {
    
    return this.commentsService.remove(+id, user);
  }
}
