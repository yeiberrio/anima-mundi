import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NovenasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.novena.findMany({
      select: { id: true, saint: true, feastDay: true, intention: true, description: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.novena.findUnique({ where: { id } });
  }

  async getRecommendations() {
    return this.prisma.novenaRecommendation.findMany({ orderBy: { recommendedDay: 'asc' } });
  }

  async getTodayRecommendation() {
    const dayOfWeek = new Date().getDay();
    return this.prisma.novenaRecommendation.findMany({ where: { recommendedDay: dayOfWeek } });
  }
}
