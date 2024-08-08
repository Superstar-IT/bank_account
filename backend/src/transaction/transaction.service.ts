import { InMemoryDBService } from '@nestjs-addons/in-memory-db';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { Cache } from 'cache-manager';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import { TransactionTypes } from 'src/core/enums/transaction-type.enum';
import { generateRandomId } from 'src/core/utils/string.utils';

@Injectable()
export class TransactionService {
  constructor(
    private transactionDBService: InMemoryDBService<TransactionEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionEntity> {
    const lastTransaction = await this.getLastTransaction();
    const balance = lastTransaction.balance + createTransactionDto.amount;
    const date = moment().format('YYYY-MM-DD');
    const newTransaction = await this.transactionDBService.create({
      id: generateRandomId(10),
      amount: createTransactionDto.amount,
      balance,
      date,
    });

    await this.cacheManager.set('last_transaction', newTransaction, 0);
    return newTransaction;
  }

  async findAll(
    filterOption?: GetTransactionsDto,
  ): Promise<TransactionEntity[]> {
    const { type } = filterOption || {};
    return await this.transactionDBService.query((transaction) =>
      type === TransactionTypes.DEPOSIT
        ? transaction.amount > 0
        : type === TransactionTypes.WITHDRAWAL
        ? transaction.amount < 0
        : true,
    );
  }

  async getLastTransaction(): Promise<TransactionEntity> {
    const lastTransaction = await this.cacheManager.get('last_transaction');
    if (lastTransaction) return lastTransaction as TransactionEntity;

    const transactions = await this.findAll();
    transactions.sort((a, b) => (a.date < b.date ? 1 : -1));
    const [recentTransaction] = transactions;

    await this.cacheManager.set(
      'last_transaction',
      recentTransaction || { balance: 0 },
      0,
    );
    return recentTransaction || ({ balance: 0 } as TransactionEntity);
  }
}
