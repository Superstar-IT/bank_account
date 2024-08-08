import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import { Transaction } from './dto/transaction.dto';
import { TransactionService } from './transaction.service';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOkResponse({ type: Transaction })
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    return await this.transactionService.create(createTransactionDto);
  }

  @Get()
  @ApiOkResponse({ type: Transaction, isArray: true })
  async findAll(@Query() params: GetTransactionsDto) {
    return await this.transactionService.findAll(params);
  }
}
