// src/products/product.dto.ts
export class ProductDto {
  name: string;
  description: string;
  quantity: number;
  supplier: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
  warehouses: { 
    location: string;
    quantity: number;
  }[];
  image_url?: string; 
}