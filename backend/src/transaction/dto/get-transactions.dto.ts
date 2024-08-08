import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, ValidateIf } from 'class-validator';
import { TransactionTypes } from 'src/core/enums/transaction-type.enum';
import { getValidateOptions } from 'src/core/validators/validation';

export class GetTransactionsDto {
  @ApiProperty({
    type: TransactionTypes,
    enum: TransactionTypes,
    required: false,
  })
  @ValidateIf((obj) => obj.type !== undefined)
  @IsEnum(TransactionTypes, getValidateOptions('Invalid transaction type'))
  type?: TransactionTypes;
}
