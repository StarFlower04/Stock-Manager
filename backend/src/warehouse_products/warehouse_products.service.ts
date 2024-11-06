import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/modules/products/product.entity';
import { Supplier } from 'src/modules/supplier/supplier.entity';
import { User } from 'src/modules/users/user.entity';
import { Repository } from 'typeorm';
import { UpdateWarehouseProductDto } from './update-warehouse-product.dto';
import { CreateWarehouseProductDto } from './create-wrehouse-product.dto';
import { Inventory } from 'src/modules/inventory/inventory.entity';

@Injectable()
export class WarehouseProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async findProductsByUserId(userId: number): Promise<Product[]> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      relations: [
        'warehouses',
        'warehouses.inventory',
        'warehouses.inventory.product',
        'warehouses.inventory.product.supplier',
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const products = user.warehouses.flatMap(warehouse =>
      warehouse.inventory.map(inventory => {
        const product = inventory.product;

        // Формуємо правильний URL-адрес для зображення
        if (product.image_url) {
          product.image_url = product.image_url.replace(
            /^.*\\backend\\dist\\/, // видаляємо все до /uploads/
            'http://localhost:3000/' // додаємо базову URL
          ).replace(/\\/g, '/'); // замінюємо backslashes на forward slashes
        }

        // Додаємо дані про склад та кількість продукту
        product['warehouses'] = [
          {
            location: warehouse.location,
            quantity: inventory.quantity,
          },
        ];

        return product;
      })
    );

    return products;
  }

  async updateProduct(productId: number, updateProductDto: UpdateWarehouseProductDto): Promise<Product> {
    const { name, description, min_quantity, price, supplier_id, image_url, first_name, last_name, email, phone_number } = updateProductDto;
  
    const product = await this.productRepository.findOne({ where: { product_id: productId }, relations: ['supplier'] });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
  
    if (supplier_id) {
      const supplier = await this.supplierRepository.findOne({ where: { supplier_id } });
      if (!supplier) {
        throw new BadRequestException(`Supplier with ID ${supplier_id} not found`);
      }
      product.supplier = supplier;
    } else if (!product.supplier) {
      // Create new supplier if none exists
      const newSupplier = this.supplierRepository.create({
        first_name,
        last_name,
        email,
        phone_number
      });
      product.supplier = await this.supplierRepository.save(newSupplier);
    } else {
      // Update existing supplier
      if (first_name) product.supplier.first_name = first_name;
      if (last_name) product.supplier.last_name = last_name;
      if (email) product.supplier.email = email;
      if (phone_number) product.supplier.phone_number = phone_number;
  
      await this.supplierRepository.save(product.supplier);
    }
  
    // Update product details
    product.name = name || product.name;
    product.description = description || product.description;
    product.min_quantity = min_quantity !== undefined ? min_quantity : product.min_quantity;
    product.price = price !== undefined ? price : product.price;
    if (image_url) product.image_url = image_url;
  
    await this.productRepository.save(product);
    return product;
  }
    
  async findProductById(productId: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { product_id: productId },
      relations: ['supplier'], // Додайте інші реляції, якщо потрібно
    });
  
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
  
    // Формуємо правильний URL-адрес для зображення
    if (product.image_url) {
      product.image_url = product.image_url.replace(
        /^.*\\backend\\dist\\/, 
        'http://localhost:3000/'
      ).replace(/\\/g, '/');
    }
  
    return product;
  }  

  async addProductToWarehouse(userId: number, createProductDto: CreateWarehouseProductDto): Promise<Product> {
    const { name, description, min_quantity, price, first_name, last_name, email, phone_number} = createProductDto;
  
    // Find or create a supplier
    let supplier = await this.supplierRepository.findOne({
      where: { 
        email,
        first_name,
        last_name,
        phone_number
      }
    });
  
    if (!supplier) {
      supplier = this.supplierRepository.create({ first_name, last_name, email, phone_number });
      await this.supplierRepository.save(supplier);
    }
  
    // Create the product
    const product = this.productRepository.create({
      name,
      description,
      min_quantity,
      price,
      image_url: null,
      supplier,
    });
  
    const savedProduct = await this.productRepository.save(product);
  
    // Find the user's warehouse
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      relations: ['warehouses'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  
    if (user.warehouses.length === 0) {
      throw new BadRequestException('User has no associated warehouses');
    }
  
    const warehouse = user.warehouses[0]; // Assuming you add the product to the first warehouse
  
    // Create or update inventory entry
    let inventory = await this.inventoryRepository.findOne({
      where: {
        product: { product_id: savedProduct.product_id },
        warehouse: { warehouse_id: warehouse.warehouse_id },
      },
    });
  
    if (!inventory) {
      inventory = this.inventoryRepository.create({
        product: savedProduct,
        warehouse,
        quantity: min_quantity || 0, // Use min_quantity from the DTO or default to 0
      });
    } else {
      // Update the existing inventory if necessary
      inventory.quantity = min_quantity || 0; // Use min_quantity from the DTO or default to 0
    }
  
    await this.inventoryRepository.save(inventory);
  
    return savedProduct;
  } 
  
  async deleteProduct(productId: number): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { product_id: productId },
      relations: ['supplier'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Delete from inventory
    await this.inventoryRepository.delete({ product: { product_id: productId } });

    // Delete the product
    await this.productRepository.delete(productId);

    // Delete the supplier if no other products are linked to it
    const linkedProducts = await this.productRepository.count({
      where: { supplier: { supplier_id: product.supplier.supplier_id } },
    });

    if (linkedProducts === 0) {
      await this.supplierRepository.delete(product.supplier.supplier_id);
    }
  }
}