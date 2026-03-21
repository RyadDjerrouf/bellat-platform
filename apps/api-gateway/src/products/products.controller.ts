import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductQueryDto } from './dto/product-query.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

// ── Public routes (/api/products, /api/categories) ────────────────────────────

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List products with pagination and filters' })
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get('autocomplete')
  @ApiOperation({ summary: 'Autocomplete product names (top 5, trigram-powered)' })
  autocomplete(@Query('q') q: string) {
    return this.productsService.autocomplete(q ?? '');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product details by ID' })
  @ApiParam({ name: 'id', example: 'prod_001' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}

// ── Public category routes (/api/categories) ──────────────────────────────────

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List all product categories' })
  findAll() {
    return this.productsService.findAllCategories();
  }

  @Get(':id/products')
  @ApiOperation({ summary: 'List products in a category' })
  @ApiParam({ name: 'id', example: 'kachir' })
  findByCategory(@Param('id') id: string, @Query() query: ProductQueryDto) {
    return this.productsService.findByCategory(id, query);
  }
}

// ── Admin routes (/api/admin/products) — require admin JWT ────────────────────

@ApiTags('Admin — Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin/products')
export class AdminProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: '[Admin] Create a new product' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: '[Admin] Update a product' })
  @ApiParam({ name: 'id', example: 'prod_001' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '[Admin] Soft-delete a product (sets isActive=false)' })
  @ApiParam({ name: 'id', example: 'prod_001' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
