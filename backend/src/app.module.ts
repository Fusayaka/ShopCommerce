import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ProductsModule } from './products/products.module.js';
import { CommentsModule } from './comments/comments.module.js';

@Module({
  imports: [UsersModule, PrismaModule, ProductsModule, CommentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
