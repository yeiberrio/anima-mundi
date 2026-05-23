import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { StoicService } from './stoic.service';

@ApiTags('Stoic')
@Controller('stoic')
export class StoicController {
  constructor(private readonly stoicService: StoicService) {}

  @Get()
  @ApiQuery({ name: 'author', required: false })
  @ApiQuery({ name: 'theme', required: false })
  findAll(@Query('author') author?: string, @Query('theme') theme?: string) {
    return this.stoicService.findAll(author, theme);
  }

  @Get('daily')
  getDailyQuote() {
    return this.stoicService.getDailyQuote();
  }

  @Get('authors')
  getAuthors() {
    return this.stoicService.getAuthors();
  }

  @Get('themes')
  getThemes() {
    return this.stoicService.getThemes();
  }
}
