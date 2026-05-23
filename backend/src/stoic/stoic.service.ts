import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoicService {
  constructor(private prisma: PrismaService) {}

  async findAll(author?: string, theme?: string) {
    return this.prisma.stoicQuote.findMany({
      where: {
        ...(author && { author }),
        ...(theme && { theme }),
      },
      orderBy: { id: 'asc' },
    });
  }

  async getDailyQuote() {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
    );
    const count = await this.prisma.stoicQuote.count();
    const index = dayOfYear % count;
    const quotes = await this.prisma.stoicQuote.findMany({ skip: index, take: 1 });
    return quotes[0] || null;
  }

  async getAuthors() {
    const quotes = await this.prisma.stoicQuote.findMany({ select: { author: true }, distinct: ['author'] });
    return quotes.map((q) => q.author);
  }

  async getThemes() {
    const quotes = await this.prisma.stoicQuote.findMany({ select: { theme: true }, distinct: ['theme'] });
    return quotes.map((q) => q.theme);
  }
}
