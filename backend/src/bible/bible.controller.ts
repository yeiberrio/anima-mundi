import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { BibleService } from './bible.service';

@ApiTags('Bible')
@Controller('bible')
export class BibleController {
  constructor(private readonly bibleService: BibleService) {}

  @Get()
  @ApiQuery({ name: 'book', required: false })
  @ApiQuery({ name: 'tag', required: false })
  findAll(@Query('book') book?: string, @Query('tag') tag?: string) {
    return this.bibleService.findAll(book, tag);
  }

  @Get('daily')
  getDailyVerse() {
    return this.bibleService.getDailyVerse();
  }

  @Get('featured')
  getFeatured() {
    return this.bibleService.getFeatured();
  }
}
