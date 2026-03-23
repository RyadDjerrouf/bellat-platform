import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from '@prisma/client';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

// DTO for the status update body — inline to keep files minimal
class UpdateStatusDto {
  @ApiProperty({ enum: OrderStatus, example: 'confirmed' })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

// ── Customer routes (/api/orders) ─────────────────────────────────────────────

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Place a new order (checkout)' })
  create(@Request() req: { user: { id: string } }, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: "List current user's orders" })
  findAll(@Request() req: { user: { id: string } }, @Query() query: OrderQueryDto) {
    return this.ordersService.findAllForUser(req.user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details' })
  @ApiParam({ name: 'id', example: 'BLT-20260321-00001' })
  findOne(@Request() req: { user: { id: string } }, @Param('id') id: string) {
    return this.ordersService.findOneForUser(req.user.id, id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a pending order' })
  @ApiParam({ name: 'id', example: 'BLT-20260321-00001' })
  cancel(@Request() req: { user: { id: string } }, @Param('id') id: string) {
    return this.ordersService.cancel(req.user.id, id);
  }

  @Post(':id/reorder')
  @ApiOperation({ summary: 'Reorder — place a new order with the same items at current prices' })
  @ApiParam({ name: 'id', example: 'BLT-20260321-00001' })
  reorder(@Request() req: { user: { id: string } }, @Param('id') id: string) {
    return this.ordersService.reorder(req.user.id, id);
  }
}

// ── Admin routes (/api/admin/orders) ─────────────────────────────────────────

@ApiTags('Admin — Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin/orders')
export class AdminOrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: '[Admin] List all orders with optional status filter' })
  findAll(@Query() query: OrderQueryDto) {
    return this.ordersService.findAll(query);
  }

  @Get('export')
  @ApiOperation({ summary: '[Admin] Export filtered orders as CSV download' })
  @Header('Content-Type', 'text/csv; charset=utf-8')
  async exportCsv(@Query() query: OrderQueryDto, @Res() res: Response) {
    const csv = await this.ordersService.exportCsv(query);
    const date = new Date().toISOString().slice(0, 10);
    res.setHeader('Content-Disposition', `attachment; filename="bellat-commandes-${date}.csv"`);
    res.send(csv);
  }

  @Get(':id')
  @ApiOperation({ summary: '[Admin] Get full order detail with customer info' })
  @ApiParam({ name: 'id', example: 'BLT-20260321-00001' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOneForAdmin(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: '[Admin] Advance order to next status' })
  @ApiParam({ name: 'id', example: 'BLT-20260321-00001' })
  @ApiBody({ type: UpdateStatusDto })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.ordersService.updateStatus(id, dto.status);
  }
}
