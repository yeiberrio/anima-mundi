import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DailyService {
  constructor(private prisma: PrismaService) {}

  async getDailyContent() {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
    );

    const verseCount = await this.prisma.bibleVerse.count();
    const quoteCount = await this.prisma.stoicQuote.count();

    const [verse] = await this.prisma.bibleVerse.findMany({ skip: dayOfYear % verseCount, take: 1 });
    const [quote] = await this.prisma.stoicQuote.findMany({ skip: dayOfYear % quoteCount, take: 1 });

    const dayOfWeek = new Date().getDay();
    const mysteryMap: Record<number, string> = {
      0: 'gloriosos', 1: 'gozosos', 2: 'dolorosos',
      3: 'gloriosos', 4: 'luminosos', 5: 'dolorosos', 6: 'gozosos',
    };
    const mystery = await this.prisma.mysterySet.findUnique({ where: { id: mysteryMap[dayOfWeek] } });

    return {
      date: new Date().toISOString().split('T')[0],
      dayOfWeek,
      verse,
      stoicQuote: quote,
      mysterySet: mystery,
    };
  }
}
