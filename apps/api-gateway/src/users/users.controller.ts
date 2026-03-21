import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

type AuthReq = { user: { id: string } };

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users/me')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ── Profile ─────────────────────────────────────────────────────────────────

  @Get()
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@Request() req: AuthReq) {
    return this.usersService.getProfile(req.user.id);
  }

  @Patch()
  @ApiOperation({ summary: 'Update profile (name, phone, password)' })
  updateProfile(@Request() req: AuthReq, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete account (blocked if active orders exist)' })
  deleteAccount(@Request() req: AuthReq) {
    return this.usersService.deleteAccount(req.user.id);
  }

  // ── Addresses ────────────────────────────────────────────────────────────────

  @Get('addresses')
  @ApiOperation({ summary: 'List saved addresses (default first)' })
  listAddresses(@Request() req: AuthReq) {
    return this.usersService.listAddresses(req.user.id);
  }

  @Post('addresses')
  @ApiOperation({ summary: 'Add a new address (max 10 per account)' })
  createAddress(@Request() req: AuthReq, @Body() dto: CreateAddressDto) {
    return this.usersService.createAddress(req.user.id, dto);
  }

  @Patch('addresses/:id')
  @ApiOperation({ summary: 'Update an address' })
  @ApiParam({ name: 'id', description: 'Address UUID' })
  updateAddress(@Request() req: AuthReq, @Param('id') id: string, @Body() dto: UpdateAddressDto) {
    return this.usersService.updateAddress(req.user.id, id, dto);
  }

  @Delete('addresses/:id')
  @ApiOperation({ summary: 'Delete an address' })
  @ApiParam({ name: 'id', description: 'Address UUID' })
  deleteAddress(@Request() req: AuthReq, @Param('id') id: string) {
    return this.usersService.deleteAddress(req.user.id, id);
  }

  @Patch('addresses/:id/default')
  @ApiOperation({ summary: 'Set an address as the default' })
  @ApiParam({ name: 'id', description: 'Address UUID' })
  setDefault(@Request() req: AuthReq, @Param('id') id: string) {
    return this.usersService.setDefaultAddress(req.user.id, id);
  }
}

// ── Admin routes (/api/admin/users) ───────────────────────────────────────────

@ApiTags('Admin — Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: '[Admin] List all customers with order count' })
  listUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('q') q?: string,
  ) {
    return this.usersService.listUsersForAdmin({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      q,
    });
  }
}
