import { Module } from '@nestjs/common';
import { PromosService } from './promos.service.js';
import { PromosController } from './promos.controller.js';

@Module({
  controllers: [PromosController],
  providers: [PromosService],
})
export class PromosModule {}
