import { Controller, Get, Post, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'List current user\'s favorite products' })
  list(@Request() req: { user: { sub: string } }) {
    return this.favoritesService.list(req.user.sub);
  }

  @Post(':productId')
  @ApiOperation({ summary: 'Add a product to favorites' })
  add(@Request() req: { user: { sub: string } }, @Param('productId') productId: string) {
    return this.favoritesService.add(req.user.sub, productId);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove a product from favorites' })
  remove(@Request() req: { user: { sub: string } }, @Param('productId') productId: string) {
    return this.favoritesService.remove(req.user.sub, productId);
  }
}
