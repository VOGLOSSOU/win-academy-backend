import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { calculateAge, isAgeInRange } from '../common/utils/age.utils';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; description?: string; image?: string; ageMin?: number; ageMax?: number }) {
    // RÈGLE: ageMin doit être <= ageMax
    if (data.ageMin !== undefined && data.ageMax !== undefined && data.ageMin > data.ageMax) {
      throw new BadRequestException('ageMin doit être inférieur ou égal à ageMax');
    }
    
    return this.prisma.category.create({ data });
  }

  async findAll(page = 1, limit = 10, userAge?: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.category.findMany({ 
        skip, 
        take: limit, 
        include: { formations: true } 
      }),
      this.prisma.category.count(),
    ]);
    
    // Si un âge est fourni, filtrer les catégories
    let filteredData = data;
    if (userAge !== undefined) {
      filteredData = data.filter(category => 
        isAgeInRange(userAge, category.ageMin, category.ageMax)
      );
    }
    
    return { 
      data: filteredData, 
      meta: { total: filteredData.length, page, limit, totalPages: Math.ceil(filteredData.length / limit) } 
    };
  }

  async findOne(id: string, userAge?: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { formations: true },
    });
    if (!category) throw new NotFoundException(`Catégorie ${id} non trouvée`);
    
    // Vérifier si l'utilisateur a l'âge requis
    if (userAge !== undefined && !isAgeInRange(userAge, category.ageMin, category.ageMax)) {
      throw new BadRequestException(
        `Vous n'avez pas l'âge requis pour cette catégorie. Age requis: ${category.ageMin}-${category.ageMax} ans`
      );
    }
    
    return category;
  }

  async update(id: string, data: Partial<{ name: string; description: string; image: string; ageMin: number; ageMax: number }>) {
    const category = await this.findOne(id);
    
    // RÈGLE: ageMin doit être <= ageMax
    const newAgeMin = data.ageMin ?? category.ageMin;
    const newAgeMax = data.ageMax ?? category.ageMax;
    if (newAgeMin > newAgeMax) {
      throw new BadRequestException('ageMin doit être inférieur ou égal à ageMax');
    }
    
    return this.prisma.category.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.category.delete({ where: { id } });
    return { message: 'Catégorie supprimée' };
  }
}
