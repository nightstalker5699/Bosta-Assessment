import { Controller, Get, Query, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportFormatDto, ReportQueryDto } from './dto/reports-dto';
import { ApiTags, ApiProduces, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role, Status } from 'src/generated/prisma/client';
import * as ExcelJS from 'exceljs';
import type { Response } from 'express';
import { ApiFileResponse } from 'src/common/decorators/api-file-response.decorator';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiFileResponse(
    'Returns a CSV or XLSX file of borrowing reports for given date range',
  )
  @Roles(Role.ADMIN)
  @Get()
  async findAll(@Query() query: ReportQueryDto, @Res() res: Response) {
    // set file name
    const fileName = `Report for ${this.formatDate(query.from)} to ${this.formatDate(query.to)}`;

    // get report data
    const data = await this.reportsService.getReportData(
      { format: query.format },
      { createdAt: { gte: query.from, lte: query.to } },
      fileName,
    );

    // stream file
    await this.streamFile(data, query.format, res, fileName);
  }

  @ApiFileResponse(
    'Returns a CSV or XLSX file of overdue borrowing reports for last month',
  )
  @Roles(Role.ADMIN)
  @Get('overdue-last-month')
  async overdueLastMonth(
    @Query() query: ReportFormatDto,
    @Res() res: Response,
  ) {
    // get last month range
    const { from, to } = this.getLastMonthRange();

    // set file name
    const fileName = 'Overdue Last Month';

    // get report data
    const data = await this.reportsService.getReportData(
      { format: query.format },
      { status: Status.BORROWED, dueDate: { lt: to, gte: from } },
      fileName,
    );

    // stream file
    await this.streamFile(data, query.format, res, fileName);
  }

  @ApiFileResponse(
    'Returns a CSV or XLSX file of borrowing reports for last month',
  )
  @Roles(Role.ADMIN)
  @Get('last-month')
  async borrowingLastMonth(
    @Query() query: ReportFormatDto,
    @Res() res: Response,
  ) {
    // get last month range
    const { from, to } = this.getLastMonthRange();

    // set file name
    const fileName = 'Borrowings Last Month';

    // get report data
    const data = await this.reportsService.getReportData(
      { format: query.format },
      { createdAt: { gte: from, lte: to } },
      fileName,
    );

    // stream file
    await this.streamFile(data, query.format, res, fileName);
  }

  // --------------------- UTIL ---------------------

  private formatDate(date: Date) {
    return date.toISOString().split('T')[0]; // gives "2026-01-01"
  }

  // get last month range
  private getLastMonthRange() {
    const now = new Date();
    return {
      from: new Date(now.getFullYear(), now.getMonth() - 1, 1),
      to: new Date(now.getFullYear(), now.getMonth(), 0),
    };
  }

  // stream file
  private async streamFile(
    data: ExcelJS.Csv | ExcelJS.Xlsx,
    format: string,
    res: Response,
    fileName: string,
  ) {
    res.setHeader(
      'Content-Type',
      format === 'csv'
        ? 'text/csv'
        : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${fileName}.${format}"`,
    );
    await data.write(res);
    res.end();
  }
}
