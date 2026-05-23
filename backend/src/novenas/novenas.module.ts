import { Module } from '@nestjs/common';
import { NovenasController } from './novenas.controller';
import { NovenasService } from './novenas.service';

@Module({
  controllers: [NovenasController],
  providers: [NovenasService],
})
export class NovenasModule {}
