  // src/user/user.controller.ts
  import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { JwtAuthGuard } from 'src/auth/jwt.guard';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { QueryUsersDto } from './dto/query-users.dto';
  import { UserService } from './user.service';

  @Controller('users')
  export class UserController {
    constructor(private users: UserService) {}

    // ====== Listar público (para pruebas) ======
    @Get('public')
    async listPublic(@Query() q: QueryUsersDto) {
      const { data, page, limit, total } = await this.users.list({
        q: q.q,
        includeInactive: q.includeInactive === 'true',
        page: q.page ?? 1,
        limit: q.limit ?? 10,
      });

      const safe = data.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        isActive: u.isActive,
        createdAt: u.createdAt,
      }));

      return { ok: true, data: safe, meta: { page, limit, total } };
    }

    // ====== Crear (público) ======
    @Post()
    async create(@Body() dto: CreateUserDto) {
      const user = await this.users.create(dto);
      return {
        ok: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isActive: user.isActive,
        },
      };
    }

    // ====== Listar (protegido) ======
    @UseGuards(JwtAuthGuard)
    @Get()
    async list(@Query() q: QueryUsersDto) {
      const { data, page, limit, total } = await this.users.list({
        q: q.q,
        includeInactive: q.includeInactive === 'true',
        page: q.page ?? 1,
        limit: q.limit ?? 10,
      });
      return { ok: true, data, meta: { page, limit, total } };
    }

    // ====== Perfil del token (protegido) ======
    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@Req() req: any) {
      return { ok: true, user: req.user };
    }

    // ====== Obtener por id (protegido) ======
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async get(@Param('id') id: string) {
      const user = await this.users.findById(Number(id));
      return { ok: !!user, user };
    }

    // ====== Editar (protegido) ======
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
      const user = await this.users.update(Number(id), dto);
      return {
        ok: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isActive: user.isActive,
        },
      };
    }

    // ====== Borrado lógico (protegido) ======
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async softDelete(@Param('id') id: string) {
      const user = await this.users.softDelete(Number(id));
      return { ok: true, user: { id: user.id, isActive: user.isActive } };
    }

    // ====== Restaurar (protegido) ======
    @UseGuards(JwtAuthGuard)
    @Patch(':id/restore')
    async restore(@Param('id') id: string) {
      const user = await this.users.restore(Number(id));
      return { ok: true, user: { id: user.id, isActive: user.isActive } };
    }

    // (Opcional) Borrado físico definitivo
    // @UseGuards(JwtAuthGuard)
    // @Delete(':id/hard')
    // hardRemove(@Param('id') id: string) {
    //   return this.users.hardRemove(Number(id));
    // }
  }
