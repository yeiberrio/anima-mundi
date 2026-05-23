import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MysteriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.mysterySet.findMany();
  }

  async findOne(id: string) {
    return this.prisma.mysterySet.findUnique({ where: { id } });
  }

  async getToday() {
    const dayOfWeek = new Date().getDay();
    const dayMap: Record<number, string> = {
      0: 'gloriosos', 1: 'gozosos', 2: 'dolorosos',
      3: 'gloriosos', 4: 'luminosos', 5: 'dolorosos', 6: 'gozosos',
    };
    const setKey = dayMap[dayOfWeek];
    return this.prisma.mysterySet.findUnique({ where: { id: setKey } });
  }
}
