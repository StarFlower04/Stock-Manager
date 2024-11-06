import { Injectable, NotFoundException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShoppingCart } from './shopping_cart.entity';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { CreateShoppingCartDto } from './create-shopping_cart.dto';
import { UpdateShoppingCartDto } from './update-shopping_cart.dto';

@Injectable()
export class ShoppingCartService {
  constructor(
    @InjectRepository(ShoppingCart)
    private shoppingCartRepository: Repository<ShoppingCart>,
    
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<ShoppingCart[]> {
    return this.shoppingCartRepository.find({ relations: ['user', 'product'] });
  }

  async findOne(id: number): Promise<ShoppingCart> {
    const cartItem = await this.shoppingCartRepository.findOne({ where: { id }, relations: ['user', 'product'] });
    if (!cartItem) {
      throw new NotFoundException(`ShoppingCart item with ID ${id} not found`);
    }
    return cartItem;
  }

  async create(createShoppingCartDto: CreateShoppingCartDto): Promise<ShoppingCart> {
    try {
      const user = await this.userRepository.findOne({ where: { user_id: createShoppingCartDto.user_id } });
      const product = await this.productRepository.findOne({ where: { product_id: createShoppingCartDto.product_id } });

      if (!user || !product) {
        throw new NotFoundException('User or Product not found');
      }

      const shoppingCart = this.shoppingCartRepository.create({
        user,
        product,
        amount: createShoppingCartDto.amount,
      });

      return await this.shoppingCartRepository.save(shoppingCart);
    } catch (error) {
      console.error('Error creating shopping cart item:', error);
      throw new InternalServerErrorException('Error creating shopping cart item');
    }
  }

  async update(id: number, updateShoppingCartDto: UpdateShoppingCartDto): Promise<ShoppingCart> {
    const cartItem = await this.shoppingCartRepository.findOne({ where: { id }, relations: ['user', 'product'] });
  
    if (!cartItem) {
      throw new NotFoundException(`ShoppingCart item with ID ${id} not found`);
    }
  
    if (updateShoppingCartDto.user_id) {
      const user = await this.userRepository.findOne({ where: { user_id: updateShoppingCartDto.user_id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      cartItem.user = user;
    }
  
    if (updateShoppingCartDto.product_id) {
      const product = await this.productRepository.findOne({ where: { product_id: updateShoppingCartDto.product_id } });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      cartItem.product = product;
    }
  
    // Оновлення полів cartItem
    Object.assign(cartItem, updateShoppingCartDto);
  
    // Оновлення поля updated_at
    cartItem.updated_at = new Date();
  
    return await this.shoppingCartRepository.save(cartItem);
  }  

  async remove(id: number): Promise<void> {
    const result = await this.shoppingCartRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`ShoppingCart item with ID ${id} not found`);
    }
  }

  async createProductCart(userId: number, createShoppingCartDto: CreateShoppingCartDto): Promise<ShoppingCart> {
    console.log('UserId:', userId);
    console.log('ProductId:', createShoppingCartDto.product_id);
  
    const user = await this.userRepository.findOne({ where: { user_id: userId } });
    if (!user) {
      console.error('User not found');
      throw new NotFoundException('User not found');
    }
  
    const product = await this.productRepository.findOne({ where: { product_id: createShoppingCartDto.product_id } });
    console.log('Product found:', product);
    if (!product) {
      console.error('Product not found');
      throw new NotFoundException('Product not found');
    }
  
    // Перевірка, чи продукт вже є в кошику
    const existingCartItem = await this.shoppingCartRepository.findOne({
      where: { user: { user_id: userId }, product: { product_id: createShoppingCartDto.product_id } }
    });
  
    if (existingCartItem) {
      throw new ConflictException('Product already exists in your cart');
    }
  
    console.log('Creating cart item...');
    const cartItem = this.shoppingCartRepository.create({
      user,
      product,
      amount: createShoppingCartDto.amount,
      created_at: new Date(),
      updated_at: new Date(),
    });
  
    const savedCartItem = await this.shoppingCartRepository.save(cartItem);
    console.log('Saved cart item:', savedCartItem);
  
    return savedCartItem;
  }   

  async getUserCartProducts(userId: number): Promise<ShoppingCart[]> {
    const cartItems = await this.shoppingCartRepository.find({
      where: { user: { user_id: userId } },
      relations: ['product'], // Додаємо відношення, щоб отримати продукти
    });
  
    // Повертаємо порожній масив, якщо немає продуктів у кошику
    return cartItems;
  }  
}