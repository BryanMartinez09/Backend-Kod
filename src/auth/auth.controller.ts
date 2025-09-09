import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const u = await this.auth.validateUser(dto.email, dto.password);
    if (!u) return { ok: false, message: 'Credenciales inválidas' };
    const token = this.auth.sign(u);
    return { ok: true, token, user: u };
  }
}
