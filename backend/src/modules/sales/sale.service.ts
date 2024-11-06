// src/sales/sale.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './sale.entity';
import { CreateSaleDto } from './create-sale.dto';
import { UpdateSaleDto } from './update-sale.dto';
import { SaleProduct } from '../sale_product/sale_product.entity';
import { User } from '../users/user.entity';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(SaleProduct)
    private saleProductRepository: Repository<SaleProduct>,
  ) {}

  async findSalesByUser(user: User): Promise<Sale[]> {
    return this.saleRepository.find({
        where: { user: { user_id: user.user_id } },
        relations: ['saleProducts', 'saleProducts.product'],
    });
}

  async findAll(): Promise<Sale[]> {
    return this.saleRepository.find();
  }

  async findOne(id: number): Promise<Sale> {
    const sale = await this.saleRepository.findOne({ where: { sale_id: id } });
    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    return sale;
  }

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    try {
      const sale = this.saleRepository.create({
        ...createSaleDto,
        sale_date: new Date(),
      });
      return await this.saleRepository.save(sale);
    } catch (error) {
      console.error('Error creating sale:', error);
      throw new InternalServerErrorException('Error creating sale');
    }
  }

  async update(id: number, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    const sale = await this.saleRepository.findOne({ where: { sale_id: id } });
    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }

    Object.assign(sale, updateSaleDto);
    return await this.saleRepository.save(sale);
  }

  async remove(id: number): Promise<void> {
    const result = await this.saleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
  }
}