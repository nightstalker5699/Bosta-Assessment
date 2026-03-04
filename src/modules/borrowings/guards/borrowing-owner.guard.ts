import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { BorrowingsService } from '../borrowings.service';
import { Role } from 'src/common/decorators/roles.decorator';

@Injectable()
export class BorrowingOwnerGuard implements CanActivate {
  constructor(private readonly borrowingsService: BorrowingsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const borrowingId = request.params.id;

    if (!user) {
      return false;
    }

    // Admins have access to everything
    if (user.role === Role.ADMIN) {
      return true;
    }

    // Check if the borrowing exists
    const borrowing = await this.borrowingsService.findOne(borrowingId);
    if (!borrowing) {
      throw new NotFoundException('Borrowing record not found');
    }

    // Check if the borrowing belongs to the current user
    if (borrowing.userId !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to access this borrowing record',
      );
    }

    return true;
  }
}
