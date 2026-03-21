import { Module } from '@nestjs/common';
import {
  ProductsController,
  CategoriesController,
  AdminProductsController,
} from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController, CategoriesController, AdminProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
