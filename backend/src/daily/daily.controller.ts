import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DailyService } from './daily.service';

@ApiTags('Daily')
@Controller('daily')
export class DailyController {
  constructor(private readonly dailyService: DailyService) {}

  @Get()
  getDailyContent() {
    return this.dailyService.getDailyContent();
  }
}
