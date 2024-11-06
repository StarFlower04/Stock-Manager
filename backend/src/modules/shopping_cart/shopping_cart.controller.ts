import { Body, Controller, Get, Param, Post, Put, Delete, HttpCode, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { ShoppingCart } from './shopping_cart.entity';
import { CreateShoppingCartDto } from './create-shopping_cart.dto';
import { UpdateShoppingCartDto } from './update-shopping_cart.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { ShoppingCartService } from './shopping_cart.service';

@ApiTags('shopping_cart')
@Controller('shopping_cart')
@UseGuards(RolesGuard)
@ApiBearerAuth('jwt')
export class ShoppingCartController {
  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @Get('all')
  @Roles('User', 'Administrator')
  @ApiOperation({ summary: 'Get all shopping cart items' })
  @ApiResponse({ status: 200, description: 'List of shopping cart items', type: [ShoppingCart] })
  findAll(): Promise<ShoppingCart[]> {
    return this.shoppingCartService.findAll();
  }

  @Get('one/:id')
  @Roles('User', 'Administrator')
  @ApiOperation({ summary: 'Get shopping cart item by ID' })
  @ApiResponse({ status: 200, description: 'Shopping cart item details', type: ShoppingCart })
  @ApiResponse({ status: 404, description: 'Shopping cart item not found' })
  findOne(@Param('id') id: number): Promise<ShoppingCart> {
    return this.shoppingCartService.findOne(id);
  }

  @Post('post')
  @Roles('User', 'Administrator')
  @ApiOperation({ summary: 'Create a new shopping cart item' })
  @ApiResponse({ status: 201, description: 'Shopping cart item created', type: ShoppingCart })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async create(@Body() createShoppingCartDto: CreateShoppingCartDto): Promise<ShoppingCart> {
    return this.shoppingCartService.create(createShoppingCartDto);
  }

  @Put('change/:id')
  @Roles('User', 'Administrator', 'Warehouse Manager')
  @ApiOperation({ summary: 'Update a shopping cart item by ID' })
  @ApiResponse({ status: 200, description: 'Shopping cart item updated', type: ShoppingCart })
  @ApiResponse({ status: 404, description: 'Shopping cart item not found' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  update(
    @Param('id') id: number,
    @Body() updateShoppingCartDto: UpdateShoppingCartDto,
  ): Promise<ShoppingCart> {
    return this.shoppingCartService.update(id, updateShoppingCartDto);
  }

  @Delete('delete/:id')
  @Roles('User', 'Administrator')
  @HttpCode(200) 
  @ApiOperation({ summary: 'Delete a shopping cart item by ID' })
  @ApiResponse({ status: 200, description: 'Shopping cart item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Shopping cart item not found' })
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.shoppingCartService.remove(id);
    return { message: `ShoppingCart item with ID ${id} has been successfully deleted` };
  }

  @Post('product/cart')
  @Roles('Administrator', 'User', 'Warehouse Manager', 'Sales Manager')
  @ApiOperation({ summary: 'Add a product to the shopping cart' })
  @ApiResponse({ status: 201, description: 'Product added to the shopping cart' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  async createProductCart(
    @Body() createShoppingCartDto: CreateShoppingCartDto,
    @Req() req: Request
  ) {
    // Додаємо логування для перевірки значення req.user
    console.log('Verified user:', req['user']); // Логування користувача
  
    const userId = req['user']?.id; // Використання id замість user_id
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
  
    return this.shoppingCartService.createProductCart(userId, createShoppingCartDto);
  }

  @Get('user/cart')
  @Roles('Administrator', 'User', 'Warehouse Manager', 'Sales Manager')
  @ApiOperation({ summary: 'Get products in the user cart' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiResponse({ status: 404, description: 'No products found in the cart' })
  async getUserCartProducts(@Req() req: Request) {
    const userId = req['user']?.id; 
    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.shoppingCartService.getUserCartProducts(userId);
  }
}