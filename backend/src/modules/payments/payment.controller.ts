import { Body, Controller, Get, Param, Post, Put, Delete, HttpCode, UseGuards, Req } from '@nestjs/common';
import { Payment } from './payment.entity';
import { CreatePaymentDto } from './create-payment.dto';
import { UpdatePaymentDto } from './update-payment.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { PaymentService } from './payment.service';

@ApiTags('payments')
@Controller('payments')
@UseGuards(RolesGuard)
@ApiBearerAuth('jwt')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout')
  @Roles('Administrator', 'User', 'Warehouse Manager', 'Sales Manager')
  @ApiOperation({ summary: 'Process payment and record sales' })
  @ApiResponse({ status: 201, description: 'Payment processed and sales recorded' })
  async handlePayment(@Req() req, @Body() createPaymentDto: CreatePaymentDto) {
    console.log('Verified user:', req.user); // Логування для перевірки
    const userId = req.user.id; // Переконайтесь, що це правильний шлях до userId
    return this.paymentService.processPayment(userId, createPaymentDto);
  }

  @Get('all')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, description: 'List of payments', type: [Payment] })
  findAll(): Promise<Payment[]> {
    return this.paymentService.findAll();
  }

  @Get('one/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment details', type: Payment })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  findOne(@Param('id') id: number): Promise<Payment> {
    return this.paymentService.findOne(id);
  }

  @Post('post')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment created', type: Payment })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async create(@Body() createPaymentDto: CreatePaymentDto): Promise<Payment> {
    return this.paymentService.create(createPaymentDto);
  }

  @Put('put/:id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Update a payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment updated', type: Payment })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  update(@Param('id') id: number, @Body() updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Delete('delete/:id')
  @Roles('Administrator')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete a payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.paymentService.remove(id);
    return { message: `Payment with ID ${id} has been successfully deleted` };
  }
}