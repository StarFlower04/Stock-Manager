import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './supplier.entity';
import { UpdateSupplierDto } from './update-supplier.dto';
import { CreateSupplierDto } from './create-supplier.dto';
import { Product } from '../products/product.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  findAll(): Promise<Supplier[]> {
    return this.supplierRepository.find();
  }

  async findOne(id: number): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({ where: { supplier_id: id } });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
    return supplier;
  }

  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    try {
      const newSupplier = this.supplierRepository.create(createSupplierDto);
      return await this.supplierRepository.save(newSupplier);
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw new InternalServerErrorException('Error creating supplier');
    }
  }  

  async update(id: number, updateData: UpdateSupplierDto): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({
      where: { supplier_id: id },
    });
  
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
  
    Object.assign(supplier, updateData);
    return await this.supplierRepository.save(supplier);
  }  

  async remove(id: number): Promise<void> {
    // Update the supplier_id to NULL for all products referencing this supplier
    await this.productRepository.update({ supplier: { supplier_id: id } }, { supplier: null });
  
    // Now, delete the supplier
    const result = await this.supplierRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
  }    
}