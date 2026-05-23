import { Module } from '@nestjs/common';
import { MysteriesController } from './mysteries.controller';
import { MysteriesService } from './mysteries.service';

@Module({
  controllers: [MysteriesController],
  providers: [MysteriesService],
})
export class MysteriesModule {}
