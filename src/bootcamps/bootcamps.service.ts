import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Bootcamp } from './entities/bootcamp.entity';


@Injectable()
export class BootcampsService {
  constructor(@InjectRepository(Bootcamp) private repo: Repository<Bootcamp>) {}

  list(q?: string) {
    if (q) {
      return this.repo.find({ where: [{ title: ILike(`%${q}%`) }, { area: ILike(`%${q}%`) }], order: { createdAt: 'DESC' } });
    }
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  get(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  create(data: Partial<Bootcamp>) {
    return this.repo.save(this.repo.create(data));
  }
}
