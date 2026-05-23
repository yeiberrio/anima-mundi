import { Module, Controller, Get } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { BibleModule } from './bible/bible.module';
import { StoicModule } from './stoic/stoic.module';
import { PrayersModule } from './prayers/prayers.module';
import { NovenasModule } from './novenas/novenas.module';
import { MysteriesModule } from './mysteries/mysteries.module';
import { TorahModule } from './torah/torah.module';
import { DailyModule } from './daily/daily.module';

@Controller('health')
class HealthController {
  @Get()
  check() {
    return { status: 'ok', version: '1.0', timestamp: new Date().toISOString() };
  }
}

@Module({
  controllers: [HealthController],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    BibleModule,
    StoicModule,
    PrayersModule,
    NovenasModule,
    MysteriesModule,
    TorahModule,
    DailyModule,
  ],
})
export class AppModule {}
