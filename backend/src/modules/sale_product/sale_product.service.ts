// src/sale-product/sale-product.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaleProduct } from './sale_product.entity';
import { CreateSaleProductDto } from './create-sale_product.dto';
import { UpdateSaleProductDto } from './update-sale_product.dto';
import { Sale } from '../sales/sale.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class SaleProductService {
  constructor(
    @InjectRepository(SaleProduct)
    private saleProductRepository: Repository<SaleProduct>,
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<SaleProduct[]> {
    return this.saleProductRepository.find({ relations: ['sale', 'product'] });
  }

  async findOne(id: number): Promise<SaleProduct> {
    const saleProduct = await this.saleProductRepository.findOne({
      where: { sale_product_id: id },
      relations: ['sale', 'product'],
    });
    if (!saleProduct) {
      throw new NotFoundException(`SaleProduct with ID ${id} not found`);
    }
    return saleProduct;
  }

  async create(createSaleProductDto: CreateSaleProductDto): Promise<SaleProduct> {
    try {
      const { sale_id, product_id, quantity } = createSaleProductDto;

      const sale = await this.saleRepository.findOne({ where: { sale_id } });
      if (!sale) {
        throw new NotFoundException(`Sale with ID ${sale_id} not found`);
      }

      const product = await this.productRepository.findOne({ where: { product_id } });
      if (!product) {
        throw new NotFoundException(`Product with ID ${product_id} not found`);
      }

      const saleProduct = this.saleProductRepository.create({
        sale,
        product,
        quantity,
      });

      return await this.saleProductRepository.save(saleProduct);
    } catch (error) {
      console.error('Error creating sale product:', error);
      throw new InternalServerErrorException('Error creating sale product');
    }
  }
  
  async update(id: number, updateSaleProductDto: UpdateSaleProductDto): Promise<SaleProduct> {
    try {
      const { sale_id, product_id, quantity } = updateSaleProductDto;

      // Знайти існуючий запис
      const saleProduct = await this.saleProductRepository.findOne({ where: { sale_product_id: id } });
      if (!saleProduct) {
        throw new NotFoundException(`SaleProduct with ID ${id} not found`);
      }

      // Перевірити наявність зв'язаних записів
      if (sale_id) {
        const sale = await this.saleRepository.findOne({ where: { sale_id } });
        if (!sale) {
          throw new NotFoundException(`Sale with ID ${sale_id} not found`);
        }
        saleProduct.sale = sale;
      }

      if (product_id) {
        const product = await this.productRepository.findOne({ where: { product_id } });
        if (!product) {
          throw new NotFoundException(`Product with ID ${product_id} not found`);
        }
        saleProduct.product = product;
      }

      if (quantity !== undefined) {
        saleProduct.quantity = quantity;
      }

      return await this.saleProductRepository.save(saleProduct);
    } catch (error) {
      console.error('Error updating sale product:', error);
      throw new InternalServerErrorException('Error updating sale product');
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.saleProductRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`SaleProduct with ID ${id} not found`);
    }
  }
}