import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, UserRole } from '../common/decorators/roles.decorator';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Créer une catégorie (Admin)' })
  create(@Body() data: any) {
    return this.categoriesService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Liste des catégories (filtrable par âge)' })
  @ApiQuery({ name: 'age', required: false, description: 'Âge de l\'utilisateur pour filtrer' })
  findAll(
    @Query('page') page = 1, 
    @Query('limit') limit = 10,
    @Query('age') age?: string,
  ) {
    const userAge = age ? parseInt(age, 10) : undefined;
    return this.categoriesService.findAll(+page, +limit, userAge);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'une catégorie (vérification âge)' })
  @ApiQuery({ name: 'age', required: false, description: 'Âge de l\'utilisateur pour vérifier l\'accès' })
  findOne(
    @Param('id') id: string,
    @Query('age') age?: string,
  ) {
    const userAge = age ? parseInt(age, 10) : undefined;
    return this.categoriesService.findOne(id, userAge);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Modifier une catégorie (Admin)' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.categoriesService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Supprimer une catégorie (Super Admin)' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
