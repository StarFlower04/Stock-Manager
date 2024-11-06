// src/modules/transactiom.controller.ts
import { Body, Controller, Get, Param, Post, Put, Delete, HttpCode, UseGuards, Req } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './create-transaction.dto';
import { UpdateTransactionDto } from './update-transaction.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateWarehouseDto } from '../warehouses/create-warehouse.dto';

@ApiTags('transactions')
@Controller('transactions')
@UseGuards(RolesGuard)
@ApiBearerAuth('jwt')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('upgrade-payment')
  @Roles('Administrator', 'User', 'Warehouse Manager', 'Sales Manager')
  @ApiOperation({ summary: 'Create a new transaction and warehouse, then upgrade user role if needed' })
  @ApiResponse({ status: 201, description: 'Transaction created and role updated', type: Transaction })
  @ApiResponse({ status: 404, description: 'User or Warehouse not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createUpgradePayment(@Req() req: any, @Body() createTransactionDto: CreateTransactionDto, @Body() createWarehouseDto: CreateWarehouseDto): Promise<Transaction> {
    const userId = req.user.id; 
    return this.transactionService.createUpgradePayment(createTransactionDto, createWarehouseDto, userId);
  }  

  @Get('all')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({ status: 200, description: 'List of transactions', type: [Transaction] })
  findAll(): Promise<Transaction[]> {
    return this.transactionService.findAll();
  }

  @Get('one/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({ status: 200, description: 'Transaction details', type: Transaction })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  findOne(@Param('id') id: number): Promise<Transaction> {
    return this.transactionService.findOne(id);
  }

  @Post('post')
  @Roles('Administrator', 'User', 'Warehouse Manager', 'Sales Manager')
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created', type: Transaction })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionService.create(createTransactionDto);
  }

  @Put('put/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Update a transaction' })
  @ApiResponse({ status: 200, description: 'Transaction updated', type: Transaction })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  update(@Param('id') id: number, @Body() updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    return this.transactionService.update(id, updateTransactionDto);
  }

  @Delete('delete/:id')
  @Roles('Administrator')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a transaction' })
  @ApiResponse({ status: 204, description: 'Transaction deleted' })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  remove(@Param('id') id: number): Promise<void> {
    return this.transactionService.remove(id);
  }
}