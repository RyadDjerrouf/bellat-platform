import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { StockStatus } from '@prisma/client';
import { InventoryService } from './inventory.service';
import { UpdateStockDto } from './dto/update-stock.dto';
import { BatchUpdateStockDto } from './dto/batch-update-stock.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Admin — Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({ summary: '[Admin] List all products with stock status + summary counts' })
  @ApiQuery({ name: 'stockStatus', enum: StockStatus, required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('stockStatus') stockStatus?: StockStatus,
    @Query('categoryId') categoryId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.inventoryService.findAll({ stockStatus, categoryId, page, limit });
  }

  @Get('alerts')
  @ApiOperation({ summary: '[Admin] Low-stock and out-of-stock report' })
  getLowStockReport() {
    return this.inventoryService.getLowStockReport();
  }

  @Patch(':id')
  @ApiOperation({ summary: '[Admin] Update stock status (and optionally price) for one product' })
  @ApiParam({ name: 'id', example: 'prod_001' })
  update(@Param('id') id: string, @Body() dto: UpdateStockDto) {
    return this.inventoryService.update(id, dto);
  }

  @Post('batch')
  @ApiOperation({ summary: '[Admin] Batch-update stock status for multiple products' })
  @ApiBody({ type: BatchUpdateStockDto })
  batchUpdate(@Body() dto: BatchUpdateStockDto) {
    return this.inventoryService.batchUpdate(dto);
  }
}
