import { Injectable } from '@nestjs/common';
import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({ 
            adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
            omit: {
                product: { deletedAt: true },
                productStock: { deletedAt: true },
                promoCodes: { deletedAt: true }
            }
        });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
