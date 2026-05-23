import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MysteriesService } from './mysteries.service';

@ApiTags('Mysteries')
@Controller('mysteries')
export class MysteriesController {
  constructor(private readonly mysteriesService: MysteriesService) {}

  @Get()
  findAll() {
    return this.mysteriesService.findAll();
  }

  @Get('today')
  getToday() {
    return this.mysteriesService.getToday();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mysteriesService.findOne(id);
  }
}
