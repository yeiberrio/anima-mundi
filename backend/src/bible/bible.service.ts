import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BibleService {
  constructor(private prisma: PrismaService) {}

  async findAll(book?: string, tag?: string) {
    return this.prisma.bibleVerse.findMany({
      where: {
        ...(book && { book }),
        ...(tag && { tags: { has: tag } }),
      },
      orderBy: [{ book: 'asc' }, { chapter: 'asc' }, { verse: 'asc' }],
    });
  }

  async getDailyVerse() {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
    );
    const count = await this.prisma.bibleVerse.count();
    const index = dayOfYear % count;
    const verses = await this.prisma.bibleVerse.findMany({ skip: index, take: 1 });
    return verses[0] || null;
  }

  async getFeatured() {
    return this.prisma.bibleVerse.findMany({ where: { isFeatured: true } });
  }
}
