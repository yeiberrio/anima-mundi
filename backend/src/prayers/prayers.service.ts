import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrayersService {
  constructor(private prisma: PrismaService) {}

  async findAll(category?: string) {
    return this.prisma.prayer.findMany({
      where: category ? { category } : undefined,
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    });
  }

  async getCategories() {
    const prayers = await this.prisma.prayer.findMany({ select: { category: true }, distinct: ['category'] });
    return prayers.map((p) => p.category);
  }
}
