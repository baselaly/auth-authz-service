import {
  ForbiddenException,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseErrorCode } from '../enums/index.enum';

export class DatabaseExceptionFilter {
  constructor(code: string, message: string) {
    switch (code) {
      case DatabaseErrorCode.DATA_NOT_FOUND:
        return new UnprocessableEntityException({ message: 'INVALID_PAYLOAD' });
      case DatabaseErrorCode.ENTRY_HAS_CHILD:
        return new ForbiddenException({ message: 'ENTRY_HAS_CHILD_ENTRIES' });
      case DatabaseErrorCode.INVALID_DATA:
        return new ForbiddenException({ message: 'INVALID_PAYLOAD' });
      case DatabaseErrorCode.DUPLICATE_ENTRY:
        return new UnprocessableEntityException({
          message: 'TRY_TO_ENTER_DUPLICATE_ENTRY',
        });
      case DatabaseErrorCode.RECORD_FOR_OPERATION_NOT_FOUND:
        return new UnprocessableEntityException({
          message: 'INVALID_RECORD_FOR_ACTION',
        });
      case DatabaseErrorCode.TABLE_NOT_FOUND:
        return new InternalServerErrorException({ message: 'TABLE_NOT_FOUND' });
      default:
        return new InternalServerErrorException({ message: message });
    }
  }
}
