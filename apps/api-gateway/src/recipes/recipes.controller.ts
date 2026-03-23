import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('recipes')
@Controller()
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  // ── Public routes ────────────────────────────────────────────────────────

  @Get('recipes')
  @ApiQuery({ name: 'category', required: false })
  findAll(@Query('category') category?: string) {
    return this.recipesService.findAll(category);
  }

  @Get('recipes/:id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(id);
  }

  // ── Admin routes ─────────────────────────────────────────────────────────

  @Get('admin/recipes')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiQuery({ name: 'category', required: false })
  findAllAdmin(@Query('category') category?: string) {
    return this.recipesService.findAllAdmin(category);
  }

  @Get('admin/recipes/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findOneAdmin(@Param('id') id: string) {
    return this.recipesService.findOneAdmin(id);
  }

  @Post('admin/recipes')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() dto: CreateRecipeDto) {
    return this.recipesService.create(dto);
  }

  @Put('admin/recipes/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdateRecipeDto) {
    return this.recipesService.update(id, dto);
  }

  @Delete('admin/recipes/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.recipesService.remove(id);
  }
}
