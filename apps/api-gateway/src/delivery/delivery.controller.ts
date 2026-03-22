import { Controller, Get, Patch, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeliveryService } from './delivery.service';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('delivery')
@Controller()
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  /** Public — used by checkout to show delivery fee for selected wilaya */
  @Get('delivery/zones')
  findAll() {
    return this.deliveryService.findAll();
  }

  /** Admin — full list including inactive zones */
  @Get('admin/delivery/zones')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAllAdmin() {
    return this.deliveryService.findAllAdmin();
  }

  /** Admin — update fee and active status for a zone */
  @Patch('admin/delivery/zones/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateZoneDto) {
    return this.deliveryService.update(id, dto.deliveryFee, dto.isActive);
  }
}
