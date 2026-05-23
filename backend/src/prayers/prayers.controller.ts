import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { PrayersService } from './prayers.service';

@ApiTags('Prayers')
@Controller('prayers')
export class PrayersController {
  constructor(private readonly prayersService: PrayersService) {}

  @Get()
  @ApiQuery({ name: 'category', required: false })
  findAll(@Query('category') category?: string) {
    return this.prayersService.findAll(category);
  }

  @Get('categories')
  getCategories() {
    return this.prayersService.getCategories();
  }
}
