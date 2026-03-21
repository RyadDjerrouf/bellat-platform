import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

const BCRYPT_ROUNDS = 12;
// Maximum saved addresses per user (prevents abuse)
const MAX_ADDRESSES = 10;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Profile ────────────────────────────────────────────────────────────────

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, fullName: true, email: true, phoneNumber: true, role: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    // Password change: verify current password first
    if (dto.newPassword) {
      if (!dto.currentPassword) {
        throw new BadRequestException('currentPassword is required to set a new password');
      }
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');
      const match = await bcrypt.compare(dto.currentPassword, user.passwordHash);
      if (!match) throw new UnauthorizedException('Current password is incorrect');
    }

    const data: Prisma.UserUpdateInput = {};
    if (dto.fullName) data.fullName = dto.fullName;
    if (dto.phoneNumber) data.phoneNumber = dto.phoneNumber;
    if (dto.newPassword) data.passwordHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);

    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data,
        select: { id: true, fullName: true, email: true, phoneNumber: true, role: true, createdAt: true },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('Phone number already in use');
      }
      throw err;
    }
  }

  // ── Addresses ──────────────────────────────────────────────────────────────

  async listAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async createAddress(userId: string, dto: CreateAddressDto) {
    const count = await this.prisma.address.count({ where: { userId } });
    if (count >= MAX_ADDRESSES) {
      throw new BadRequestException(`Maximum ${MAX_ADDRESSES} addresses per account`);
    }

    // If first address or isDefault requested — ensure only one default
    const shouldBeDefault = dto.isDefault ?? count === 0;

    if (shouldBeDefault) {
      await this.prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }

    return this.prisma.address.create({
      data: { userId, ...dto, isDefault: shouldBeDefault },
    });
  }

  async updateAddress(userId: string, addressId: string, dto: UpdateAddressDto) {
    await this.findAddressForUser(userId, addressId);

    if (dto.isDefault) {
      // Clear other defaults before setting this one
      await this.prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    }

    return this.prisma.address.update({
      where: { id: addressId },
      data: dto,
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    await this.findAddressForUser(userId, addressId);
    await this.prisma.address.delete({ where: { id: addressId } });
    // If deleted address was the default, promote the next most recent
    const remaining = await this.prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    if (remaining.length > 0 && !remaining.some((a) => a.isDefault)) {
      await this.prisma.address.update({ where: { id: remaining[0].id }, data: { isDefault: true } });
    }
    return { deleted: true };
  }

  async setDefaultAddress(userId: string, addressId: string) {
    await this.findAddressForUser(userId, addressId);
    await this.prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
    return this.prisma.address.update({ where: { id: addressId }, data: { isDefault: true } });
  }

  // ── Admin ───────────────────────────────────────────────────────────────────

  async listUsersForAdmin(params: { page?: number; limit?: number; q?: string }) {
    const { page = 1, limit = 20, q } = params;
    const skip = (page - 1) * limit;

    const where = q
      ? {
          OR: [
            { fullName: { contains: q, mode: 'insensitive' as const } },
            { email: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : undefined;

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        select: {
          id: true, fullName: true, email: true, phoneNumber: true,
          role: true, createdAt: true,
          _count: { select: { orders: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return { data: users, meta: { total, page, totalPages: Math.ceil(total / limit) } };
  }

  private async findAddressForUser(userId: string, addressId: string) {
    const address = await this.prisma.address.findUnique({ where: { id: addressId } });
    if (!address || address.userId !== userId) {
      throw new NotFoundException(`Address '${addressId}' not found`);
    }
    return address;
  }
}
