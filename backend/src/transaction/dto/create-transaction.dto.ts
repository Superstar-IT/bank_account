import { ApiProperty } from '@nestjs/swagger';
import { NotEquals } from 'class-validator';
import { getValidateOptions } from 'src/core/validators/validation';

export class CreateTransactionDto {
  @ApiProperty({ type: Number, required: true })
  @NotEquals(0, getValidateOptions('amount required'))
  amount: number;
}
