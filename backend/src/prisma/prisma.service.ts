import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    // Don't block app startup on the DB connection: Prisma connects lazily on
    // the first query anyway. Blocking here meant a slow/failing DB connection
    // prevented the HTTP server from listening, so the Railway healthcheck
    // failed and the deployment never went live.
    this.$connect().catch((e) => {
      console.error('Prisma initial $connect failed (will retry lazily):', e);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
