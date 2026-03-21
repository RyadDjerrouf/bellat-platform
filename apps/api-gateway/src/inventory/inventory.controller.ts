import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
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
  @ApiQuery({ name: 'q', required: false, description: 'Search by product name (FR or AR)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('stockStatus') stockStatus?: StockStatus,
    @Query('categoryId') categoryId?: string,
    @Query('q') q?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.inventoryService.findAll({ stockStatus, categoryId, q, page, limit });
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

  @Post('import')
  @ApiOperation({ summary: '[Admin] Import stock levels from CSV file (productId,stockStatus columns)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 2 * 1024 * 1024 } })) // 2 MB max
  importCsv(@UploadedFile() file: Express.Multer.File) {
    return this.inventoryService.importFromCsv(file.buffer);
  }
}
