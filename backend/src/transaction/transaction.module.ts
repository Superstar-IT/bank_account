import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [InMemoryDBModule.forFeature('transactions')],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
