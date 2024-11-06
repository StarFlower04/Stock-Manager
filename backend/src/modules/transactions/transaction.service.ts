// src/modules/transactiom.service.ts
import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, DataSource } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './create-transaction.dto';
import { UpdateTransactionDto } from './update-transaction.dto';
import { User } from '../users/user.entity';
import { Warehouse } from '../warehouses/warehouse.entity';
import { CreateWarehouseDto } from '../warehouses/create-warehouse.dto';
import { Role } from '../roles/role.entity';
import { isBefore, startOfMonth } from 'date-fns';

@Injectable()
export class TransactionService {
  constructor(
    private readonly dataSource: DataSource,
    
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,

    @InjectRepository(Role) 
    private roleRepository: Repository<Role>,
  ) {}

  async createUpgradePayment(
    createTransactionDto: CreateTransactionDto,
    createWarehouseDto: CreateWarehouseDto,
    userId: number
  ): Promise<Transaction> {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      try {
        const user = await manager.findOne(this.userRepository.target, { where: { user_id: userId } });
        if (!user) {
          throw new NotFoundException('User not found');
        }
  
        // Перевірка дати
        const currentMonthStart = startOfMonth(new Date());
        const transactionDate = new Date(createTransactionDto.date);
  
        if (isBefore(transactionDate, currentMonthStart)) {
          throw new BadRequestException('The transaction date cannot be earlier than the current month.');
        }
  
        // Створення складу з прив'язкою до користувача
        const warehouse = manager.create(this.warehouseRepository.target, {
          ...createWarehouseDto,
          user, // Прив'язуємо user до складу
        });
        await manager.save(this.warehouseRepository.target, warehouse);
  
        // Створення транзакції
        const transaction = manager.create(this.transactionRepository.target, {
          ...createTransactionDto,
          user,
          warehouse,
        });
  
        const savedTransaction = await manager.save(this.transactionRepository.target, transaction);
  
        // Зміна ролі користувача, якщо необхідно
        if (user.role_id === 26) { // Перевіряємо, чи роль користувача є User
          user.role_id = 2; // Змінюємо на Warehouse Manager
          await manager.save(this.userRepository.target, user);
        }
  
        return savedTransaction;
      } catch (error) {
        console.error('Error creating transaction:', error);
        throw new InternalServerErrorException('Error creating transaction');
      }
    });
  }  
  
  async findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find({
      relations: ['user', 'warehouse'],
    });
  }

  async findOne(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { transaction_id: id },
      relations: ['user', 'warehouse'],
    });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    try {
      const { user_id, warehouse_id } = createTransactionDto;

      const user = user_id ? await this.userRepository.findOne({ where: { user_id } }) : null;
      const warehouse = warehouse_id
        ? await this.warehouseRepository.findOne({ where: { warehouse_id } })
        : null;

      const transaction = this.transactionRepository.create({
        ...createTransactionDto,
        user,
        warehouse,
      });

      return await this.transactionRepository.save(transaction);
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw new InternalServerErrorException('Error creating transaction');
    }
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { transaction_id: id },
      relations: ['user', 'warehouse'],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    if (updateTransactionDto.user_id) {
      const user = await this.userRepository.findOne({ where: { user_id: updateTransactionDto.user_id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      transaction.user = user;
    }

    if (updateTransactionDto.warehouse_id) {
      const warehouse = await this.warehouseRepository.findOne({ where: { warehouse_id: updateTransactionDto.warehouse_id } });
      if (!warehouse) {
        throw new NotFoundException('Warehouse not found');
      }
      transaction.warehouse = warehouse;
    }

    Object.assign(transaction, updateTransactionDto);
    return await this.transactionRepository.save(transaction);
  }

  async remove(id: number): Promise<void> {
    const result = await this.transactionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
  }
}