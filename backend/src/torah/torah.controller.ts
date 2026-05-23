import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TorahService } from './torah.service';

@ApiTags('Torah')
@Controller('torah')
export class TorahController {
  constructor(private readonly torahService: TorahService) {}

  @Get('glossary')
  getGlossary() {
    return this.torahService.getGlossary();
  }

  @Get('books')
  getBooks() {
    return this.torahService.getBooks();
  }

  @Get('parashat')
  getParashat() {
    return this.torahService.getParashat();
  }

  @Get('chapter/:book/:chapter')
  getChapter(@Param('book') book: string, @Param('chapter', ParseIntPipe) chapter: number) {
    return this.torahService.getChapter(book, chapter);
  }
}
