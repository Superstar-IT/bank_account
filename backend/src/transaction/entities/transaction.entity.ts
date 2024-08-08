import { InMemoryDBEntity } from '@nestjs-addons/in-memory-db';

export interface TransactionEntity extends InMemoryDBEntity {
  date: string;
  amount: number;
  balance: number;
}
