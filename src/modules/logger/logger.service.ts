import { Injectable, Logger, Scope } from '@nestjs/common';
import { ILogger } from '../../common/interfaces/Logger';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements ILogger {
  private logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  log(message: any, context?: string): void {
    if (typeof message === 'object') {
      this.logger.log(JSON.stringify(message));
    } else {
      this.logger.log(message);
    }
  }

  error(message: any, trace?: string, context?: string): void {
    if (typeof message === 'object') {
      this.logger.error(JSON.stringify(message), trace);
    } else {
      this.logger.error(message, trace);
    }
  }

  warn(message: any, context?: string): void {
    if (typeof message === 'object') {
      this.logger.warn(JSON.stringify(message));
    } else {
      this.logger.warn(message);
    }
  }

  debug(message: any, context?: string): void {
    if (typeof message === 'object') {
      this.logger.debug(JSON.stringify(message));
    } else {
      this.logger.debug(message);
    }
  }

  verbose(message: any, context?: string): void {
    if (typeof message === 'object') {
      this.logger.verbose(JSON.stringify(message));
    } else {
      this.logger.verbose(message);
    }
  }
}
