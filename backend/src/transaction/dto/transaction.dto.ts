import { ApiProperty } from '@nestjs/swagger';

export class Transaction {
  @ApiProperty({ type: String, required: true })
  readonly id: string;

  @ApiProperty({ type: String, required: true })
  date: string;

  @ApiProperty({ type: Number, required: true })
  amount: number;

  @ApiProperty({ type: Number, required: true })
  balance: number;
}
