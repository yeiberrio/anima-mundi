import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NovenasService } from './novenas.service';

@ApiTags('Novenas')
@Controller('novenas')
export class NovenasController {
  constructor(private readonly novenasService: NovenasService) {}

  @Get()
  findAll() {
    return this.novenasService.findAll();
  }

  @Get('recommendations')
  getRecommendations() {
    return this.novenasService.getRecommendations();
  }

  @Get('recommendations/today')
  getTodayRecommendation() {
    return this.novenasService.getTodayRecommendation();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.novenasService.findOne(id);
  }
}
