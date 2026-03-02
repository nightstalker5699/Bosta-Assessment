import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  // Prisma 7: use composition instead of extending PrismaClient
  private readonly prisma: PrismaClient;

  constructor(private readonly configService: ConfigService) {
    const connection = new Pool({
      connectionString: this.configService.get<string>('database.url'),
    });
    this.prisma = new PrismaClient({
      adapter: new PrismaPg(connection),

      log: ['error'],
      errorFormat: 'pretty',
    });
  }

  async onModuleInit() {
    await this.prisma.$connect();
    this.logger.log('Database connected successfully');
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
    this.logger.log('Database disconnected');
  }

  // Expose the client for use in other services
  get client(): PrismaClient {
    return this.prisma;
  }
}
