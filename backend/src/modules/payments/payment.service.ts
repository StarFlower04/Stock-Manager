import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { CreatePaymentDto } from './create-payment.dto';
import { UpdatePaymentDto } from './update-payment.dto';
import { ShoppingCart } from '../shopping_cart/shopping_cart.entity';
import { SaleProduct } from '../sale_product/sale_product.entity';
import { Sale } from '../sales/sale.entity';
import { User } from '../users/user.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(ShoppingCart)
    private shoppingCartRepository: Repository<ShoppingCart>,
    @InjectRepository(SaleProduct)
    private saleProductRepository: Repository<SaleProduct>,
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async processPayment(userId: number, createPaymentDto: CreatePaymentDto) {
    if (!userId) {
      throw new Error('User ID is required for processing payment.');
    }
  
    await this.paymentRepository.manager.transaction(async (transactionalEntityManager) => {
      // Get cart items
      const cartItems = await transactionalEntityManager.find(ShoppingCart, {
        where: { user: { user_id: userId } },
        relations: ['product'],
      });
  
      // Check if cart is empty
      if (cartItems.length === 0) {
        throw new Error('The user\'s cart is empty. Cannot process payment.');
      }
  
      // Create sale
      const saleResult = await transactionalEntityManager.createQueryBuilder()
        .insert()
        .into(Sale)
        .values({
          user_id: userId,
          sale_cost: createPaymentDto.amount,
          sale_date: new Date(),
          status: 'Processed', // Set initial status
        })
        .returning('sale_id')
        .execute();
  
      const saleId = saleResult.identifiers[0].sale_id;
  
      if (!saleId) {
        throw new Error('Sale creation failed.');
      }
  
      // Create payment
      const paymentResult = await transactionalEntityManager.createQueryBuilder()
        .insert()
        .into(Payment)
        .values({
          user_id: userId,
          amount: createPaymentDto.amount,
          status: 'successful',
          payment_date: new Date(),
          payment_method: createPaymentDto.payment_method,
          card_number: createPaymentDto.card_number,
          card_expiry: createPaymentDto.card_expiry,
          card_cvv: createPaymentDto.card_cvv,
          first_name: createPaymentDto.first_name,
          last_name: createPaymentDto.last_name,
        })
        .returning('payment_id')
        .execute();
  
      const paymentId = paymentResult.identifiers[0].payment_id;
  
      if (!paymentId) {
        throw new Error('Payment creation failed.');
      }
  
      // Insert sale products
      const saleProducts = cartItems.map(item => ({
        sale: { sale_id: saleId },
        product: item.product,
        quantity: item.amount
      }));
  
      await transactionalEntityManager.createQueryBuilder()
        .insert()
        .into(SaleProduct)
        .values(saleProducts)
        .execute();
  
      // Clear shopping cart
      await transactionalEntityManager.delete(ShoppingCart, { user: { user_id: userId } });
  
      // Schedule status update to "Delivered" after 5 minutes
      this.scheduleStatusUpdate(saleId);
    });
  }
  
  private async scheduleStatusUpdate(saleId: number) {
    // Use setTimeout to delay status update
    setTimeout(async () => {
      try {
        await this.saleRepository.createQueryBuilder()
          .update(Sale)
          .set({ status: 'Delivered' })
          .where('sale_id = :saleId', { saleId })
          .execute();
  
        // Log status change to console
        console.log(`Sale with ID ${saleId} status updated to "Delivered"`);
      } catch (error) {
        console.error('Error updating sale status:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes
  }  

  
  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find();
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { payment_id: id } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return payment;
  }

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    try {
      const payment = this.paymentRepository.create(createPaymentDto);
      return await this.paymentRepository.save(payment);
    } catch (error) {
      console.error('Error creating payment:', error);
      throw new InternalServerErrorException('Error creating payment');
    }
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { payment_id: id } });
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    Object.assign(payment, updatePaymentDto);
    return await this.paymentRepository.save(payment);
  }

  async remove(id: number): Promise<void> {
    const result = await this.paymentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
  }
}