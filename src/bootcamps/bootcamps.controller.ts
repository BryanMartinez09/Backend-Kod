import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { BootcampsService } from './bootcamps.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateBootcampDto } from './dto/create-bootcamp.dto';

@Controller('bootcamps')
export class BootcampsController {
  constructor(private readonly srv: BootcampsService) {}

  // Público: landing
  @Get()
  async list(@Query('q') q?: string) {
    const data = await this.srv.list(q);
    return { ok: true, data };
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    const data = await this.srv.get(id);
    if (!data) throw new NotFoundException('Bootcamp no encontrado');
    return { ok: true, data };
  }

  // Protegido: crear (dashboard interno)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: CreateBootcampDto) {
    const created = await this.srv.create(body);
    return { ok: true, data: created };
  }
}
