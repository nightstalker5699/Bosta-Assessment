import { Global, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Global()
@Module({
  providers: [{ provide: 'ILogger', useClass: LoggerService }],
  exports: ['ILogger'],
})
export class loggerModule {}
