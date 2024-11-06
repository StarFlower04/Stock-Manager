// src/products/product.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';
import { Supplier } from '../supplier/supplier.entity';
import { Tag } from '../tags/tag.entity';
import { InventoryService } from '../inventory/inventory.service';
import { ProductDto } from './product.dto';
import { Inventory } from '../inventory/inventory.entity';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private inventoryService: InventoryService,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
  ) {}

  async uploadImage(file: Express.Multer.File, productId: number): Promise<Product> {
    const product = await this.productRepository.findOne({ 
      where: { product_id: productId },
      relations: ['supplier']
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const uploadDir = join(__dirname, '..', '..', 'uploads', 'products');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = join(uploadDir, file.filename);
    product.image_url = filePath;
    
    return await this.productRepository.save(product);
  }

  async findAllWithDetails(): Promise<ProductDto[]> {
    const products = await this.productRepository.find({
      relations: ['supplier'],
    });
  
    const inventories = await this.inventoryRepository.find({
      relations: ['product', 'warehouse'],
    });
  
    return products.map(product => {
      const productInventories = inventories.filter(inv => inv.product.product_id === product.product_id);
  
      const warehouses = productInventories.map(inv => ({
        location: inv.warehouse.location,
        quantity: inv.quantity,
      }));
  
      // Correcting the imageUrl
      let imageUrl = product.image_url;
      if (imageUrl) {
        imageUrl = imageUrl.replace(/^.*[\\\/]/, ''); // Remove any directory information from the image path
      }
  
      return {
        product_id: product.product_id, // Add product_id
        name: product.name,
        description: product.description,
        price: product.price, // Add price
        quantity: product.min_quantity,
        supplier: {
          firstName: product.supplier.first_name,
          lastName: product.supplier.last_name,
          email: product.supplier.email,
          phoneNumber: product.supplier.phone_number,
        },
        warehouses: warehouses.length > 0 ? warehouses : null,
        imageUrl: `http://localhost:3000/uploads/products/${imageUrl}`,
      };
    });
  }  

  async findAll(): Promise<Product[]> {
    const products = await this.productRepository.find({ relations: ['supplier'] });
  
    for (const product of products) {
      const inventory = await this.inventoryService.findByProduct(product.product_id);
      product['warehouses'] = inventory.map(inv => ({
        location: inv.warehouse.location,
        quantity: inv.quantity
      }));
    }
  
    return products;
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ 
      where: { product_id: id },
      relations: ['supplier']
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { supplier_id, ...productData } = createProductDto;

    const supplier = await this.supplierRepository.findOne({ where: { supplier_id } });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${supplier_id} not found`);
    }

    const product = this.productRepository.create({
      ...productData,
      supplier,
    });

    try {
      const savedProduct = await this.productRepository.save(product);

      const newTag = this.tagRepository.create({
        product: savedProduct,
        rfid_code: this.generateUniqueRfidCode(),
      });
      await this.tagRepository.save(newTag);

      return savedProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new InternalServerErrorException('Error creating product');
    }
  }

  private generateUniqueRfidCode(): string {
    return 'RFID-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { product_id: id },
      relations: ['supplier'], 
    });
  
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}