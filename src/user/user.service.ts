import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  // ===== Helpers
  private async ensureEmailFree(email: string, exceptId?: number) {
    const existing = await this.repo.findOne({ where: { email } });
    if (existing && existing.id !== exceptId) {
      throw new BadRequestException('Email ya registrado');
    }
  }

  // ===== Queries
  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async list(params: { q?: string; includeInactive?: boolean; page?: number; limit?: number }) {
    const { q, includeInactive = false, page = 1, limit = 10 } = params;

    const [data, total] = await this.repo.findAndCount({
      where: q
        ? [
            { ...(includeInactive ? {} : { isActive: true }), name: ILike(`%${q}%`) },
            { ...(includeInactive ? {} : { isActive: true }), email: ILike(`%${q}%`) },
          ]
        : { ...(includeInactive ? {} : { isActive: true }) },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return { data, page, limit, total };
  }

  
  async create(data: Partial<User>) {
    await this.ensureEmailFree(data.email!);
    const u = this.repo.create(data);
    // NO hashear aquí; lo hace @BeforeInsert en la entidad
    return this.repo.save(u);
  }


  async update(id: number, changes: Partial<User>) {
    const u = await this.repo.findOne({ where: { id } });
    if (!u) throw new NotFoundException('Usuario no encontrado');

    if (changes.email && changes.email !== u.email) {
      await this.ensureEmailFree(changes.email, id);
    }
    if (changes.password) {
      changes.password = await bcrypt.hash(changes.password, 10);
    }

    Object.assign(u, changes);
    return this.repo.save(u);
  }

  /** Borrado lógico: isActive = false */
  async softDelete(id: number) {
    const u = await this.repo.findOne({ where: { id } });
    if (!u) throw new NotFoundException('Usuario no encontrado');
    u.isActive = false;
    return this.repo.save(u);
  }

  /** Restaurar usuario */
  async restore(id: number) {
    const u = await this.repo.findOne({ where: { id } });
    if (!u) throw new NotFoundException('Usuario no encontrado');
    u.isActive = true;
    return this.repo.save(u);
  }

  /** (Opcional) Borrado físico definitivo */
  async hardRemove(id: number) {
    const u = await this.repo.findOne({ where: { id } });
    if (!u) throw new NotFoundException('Usuario no encontrado');
    await this.repo.remove(u);
    return { ok: true };
  }
}
