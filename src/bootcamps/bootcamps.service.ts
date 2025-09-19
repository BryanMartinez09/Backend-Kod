import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Raw } from 'typeorm';
import { Bootcamp } from './entities/bootcamp.entity';

@Injectable()
export class BootcampsService {
  constructor(@InjectRepository(Bootcamp) private repo: Repository<Bootcamp>) {}

  list(q?: string) {
    if (q) {
      // Forzamos case-insensitive incluso si la collation no lo es
      const needle = q.toLowerCase();
      return this.repo.find({
        where: [
          { title: Raw(alias => `LOWER(${alias}) LIKE '%${needle}%'`) },
          { area:  Raw(alias => `LOWER(${alias}) LIKE '%${needle}%'`) },
        ],
        order: { createdAt: 'DESC' },
      });
      // Si tu collation ya es CI puedes usar:
      // where: [{ title: Like(`%${q}%`) }, { area: Like(`%${q}%`) }]
    }
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  get(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  create(data: Partial<Bootcamp>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }
}
