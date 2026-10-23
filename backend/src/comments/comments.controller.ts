import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { CommentsService } from './comments.service.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { UpdateCommentDto } from './dto/update-comment.dto.js';
import { GetCommentQueryDto } from './dto/get-comment.dto.js';
import { Public } from '../common/decorators/public.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
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

  // Kiểm tra người dùng hiện tại có được đánh giá sản phẩm hay không.
  // Phải khai báo TRƯỚC @Get(':id') để không bị route ':id' bắt mất.
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
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
