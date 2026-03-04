import * as ExcelJS from 'exceljs';
import { Injectable } from '@nestjs/common';
import { BorrowingsService } from '../borrowings/borrowings.service';
import { ReportFormatDto, ReportQueryDto } from './dto/reports-dto';
import { Prisma, Borrowing, User, Book } from '../../generated/prisma/client';

type BorrowingWithRelations = Borrowing & {
  book: Book;
  user: User;
};

@Injectable()
export class ReportsService {
  constructor(private readonly borrowingsService: BorrowingsService) {}

  async getReportData(
    format: ReportFormatDto,
    where: Prisma.BorrowingWhereInput,
    sheetName: string,
  ) {
    // raw Data reterival from DB
    const borrowings = await this.borrowingsService.findAllForReport({
      where,
    });

    // create workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // add columns and rows
    worksheet.columns = this.getColumns();
    worksheet.addRows(this.getRows(borrowings));

    // return workbook based on format
    if (format.format === 'csv') return workbook.csv;
    else return workbook.xlsx;
  }

  // --------------------- UTIL ---------------------

  private getColumns() {
    return [
      { header: 'Book Title', key: 'bookTitle', width: 30 },
      { header: 'User Name', key: 'userName', width: 30 },
      { header: 'Due Date', key: 'dueDate', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Borrow Date', key: 'borrowDate', width: 15 },
      { header: 'Return Date', key: 'returnDate', width: 15 },
    ];
  }

  private getRows(borrowings: BorrowingWithRelations[]) {
    return borrowings.map((borrowing) => ({
      bookTitle: borrowing.book?.title,
      userName: borrowing.user?.name,
      dueDate: borrowing.dueDate.toISOString().split('T')[0],
      status: borrowing.status,
      borrowDate: borrowing.borrowDate.toISOString().split('T')[0],
      returnDate: borrowing.returnDate?.toISOString().split('T')[0],
    }));
  }
}
