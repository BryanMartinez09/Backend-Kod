import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { BootcampsService } from './bootcamps.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('bootcamps')
export class BootcampsController {
  constructor(private srv: BootcampsService) {}

  // Público: para landing
  @Get()
  async list(@Query('q') q?: string) {
    const data = await this.srv.list(q);
    return { ok: true, data };
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const data = await this.srv.get(Number(id));
    return { ok: !!data, data };
  }

  // Protegido: crear (p.ej. desde dashboard interno)
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: any) {
    const created = await this.srv.create(body);
    return { ok: true, data: created };
  }
}
