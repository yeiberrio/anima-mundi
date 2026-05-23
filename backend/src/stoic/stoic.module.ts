import { Module } from '@nestjs/common';
import { StoicController } from './stoic.controller';
import { StoicService } from './stoic.service';

@Module({
  controllers: [StoicController],
  providers: [StoicService],
})
export class StoicModule {}
