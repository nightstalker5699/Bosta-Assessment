import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { BorrowingsModule } from '../borrowings/borrowings.module';

@Module({
  imports: [BorrowingsModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
