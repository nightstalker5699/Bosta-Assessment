import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from './modules/config/config.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { LoggerMiddleware } from './common/logger.middleware';
import { loggerModule } from './modules/logger/logger.module';

@Module({
  imports: [ConfigModule, PrismaModule, loggerModule],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
